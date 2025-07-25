class ApiQueryBuilder {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Search functionality
  search() {
    if (this.queryString.search) {
      const searchFields = this.queryString.searchFields || ['name', 'description'];
      const searchRegex = new RegExp(this.queryString.search, 'i');
      
      const searchConditions = searchFields.map(field => ({
        [field]: searchRegex
      }));
      
      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  // Advanced search with multiple fields
  advancedSearch(searchableFields = []) {
    if (this.queryString.search && searchableFields.length > 0) {
      const searchRegex = new RegExp(this.queryString.search, 'i');
      
      const searchConditions = searchableFields.map(field => {
        // Handle nested fields (e.g., 'customer.name')
        if (field.includes('.')) {
          return { [field]: searchRegex };
        }
        return { [field]: searchRegex };
      });
      
      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  // Filter functionality
  filter() {
    const queryObj = { ...this.queryString };
    
    // Exclude special query parameters
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'searchFields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Handle advanced filtering operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|in|nin)\b/g, match => `$${match}`);
    
    const filterObj = JSON.parse(queryStr);
    
    // Handle array filters (e.g., status=open,ready)
    Object.keys(filterObj).forEach(key => {
      if (typeof filterObj[key] === 'string' && filterObj[key].includes(',')) {
        filterObj[key] = { $in: filterObj[key].split(',') };
      }
    });

    this.query = this.query.find(filterObj);
    return this;
  }

  // Date range filtering
  dateFilter(dateField = 'createdAt') {
    if (this.queryString.startDate || this.queryString.endDate) {
      const dateQuery = {};
      
      if (this.queryString.startDate) {
        dateQuery.$gte = new Date(this.queryString.startDate);
      }
      
      if (this.queryString.endDate) {
        dateQuery.$lte = new Date(this.queryString.endDate);
      }
      
      this.query = this.query.find({ [dateField]: dateQuery });
    }
    return this;
  }

  // Sorting functionality
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by creation date (newest first)
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    
    // Store pagination info for later use
    this.paginationInfo = { page, limit, skip };
    return this;
  }

  // Population
  populate(populateOptions = []) {
    if (populateOptions.length > 0) {
      populateOptions.forEach(option => {
        this.query = this.query.populate(option);
      });
    }
    return this;
  }

  // Execute query and return results with pagination info
  async execute(Model) {
    try {
      // Get total count for pagination
      const totalQuery = Model.find(this.query.getFilter());
      const total = await totalQuery.countDocuments();
      
      // Execute main query
      const data = await this.query;
      
      // Calculate pagination info
      const { page, limit } = this.paginationInfo || { page: 1, limit: 10 };
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get aggregation pipeline for complex queries
  getAggregationPipeline() {
    const pipeline = [];
    
    // Add match stage for filtering
    const matchStage = {};
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'searchFields'];
    excludedFields.forEach(el => delete queryObj[el]);
    
    if (Object.keys(queryObj).length > 0) {
      Object.assign(matchStage, queryObj);
    }
    
    // Add search conditions
    if (this.queryString.search) {
      const searchFields = this.queryString.searchFields || ['name', 'description'];
      const searchConditions = searchFields.map(field => ({
        [field]: { $regex: this.queryString.search, $options: 'i' }
      }));
      matchStage.$or = searchConditions;
    }
    
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }
    
    // Add sort stage
    if (this.queryString.sort) {
      const sortObj = {};
      this.queryString.sort.split(',').forEach(field => {
        if (field.startsWith('-')) {
          sortObj[field.substring(1)] = -1;
        } else {
          sortObj[field] = 1;
        }
      });
      pipeline.push({ $sort: sortObj });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }
    
    return pipeline;
  }

  // Static method for quick filtering
  static filter(Model, queryString) {
    return new ApiQueryBuilder(Model.find(), queryString);
  }

  // Static method for aggregation
  static aggregate(Model, queryString) {
    const builder = new ApiQueryBuilder(null, queryString);
    const pipeline = builder.getAggregationPipeline();
    return Model.aggregate(pipeline);
  }
}

module.exports = ApiQueryBuilder;