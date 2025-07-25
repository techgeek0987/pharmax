const ApiQueryBuilder = require('../utils/ApiQueryBuilder');

class BaseService {
  constructor(model, modelName, populateOptions = []) {
    this.model = model;
    this.modelName = modelName;
    this.populateOptions = populateOptions;
  }

  // Get all resources with filtering, searching, sorting, and pagination
  async getAll(queryString) {
    try {
      const queryBuilder = new ApiQueryBuilder(this.model.find(), queryString);
      
      const result = await queryBuilder
        .filter()
        .search()
        .sort()
        .limitFields()
        .populate(this.populateOptions)
        .paginate()
        .execute(this.model);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Advanced search with custom searchable fields
  async search(queryString, searchableFields = []) {
    try {
      const queryBuilder = new ApiQueryBuilder(this.model.find(), queryString);
      
      const result = await queryBuilder
        .advancedSearch(searchableFields)
        .filter()
        .sort()
        .limitFields()
        .populate(this.populateOptions)
        .paginate()
        .execute(this.model);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get single resource by ID
  async getById(id) {
    try {
      let query = this.model.findById(id);
      
      // Apply population if configured
      if (this.populateOptions.length > 0) {
        this.populateOptions.forEach(option => {
          query = query.populate(option);
        });
      }
      
      return await query;
    } catch (error) {
      throw error;
    }
  }

  // Get single resource by custom field
  async getByField(field, value) {
    try {
      let query = this.model.findOne({ [field]: value });
      
      if (this.populateOptions.length > 0) {
        this.populateOptions.forEach(option => {
          query = query.populate(option);
        });
      }
      
      return await query;
    } catch (error) {
      throw error;
    }
  }

  // Create new resource
  async create(data) {
    try {
      const resource = new this.model(data);
      await resource.save();
      
      // Return populated resource if population is configured
      if (this.populateOptions.length > 0) {
        return await this.getById(resource._id);
      }
      
      return resource;
    } catch (error) {
      throw error;
    }
  }

  // Update resource
  async update(id, data) {
    try {
      const resource = await this.model.findByIdAndUpdate(
        id,
        { ...data, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      
      if (!resource) {
        return null;
      }
      
      // Return populated resource if population is configured
      if (this.populateOptions.length > 0) {
        return await this.getById(resource._id);
      }
      
      return resource;
    } catch (error) {
      throw error;
    }
  }

  // Update resource by custom field
  async updateByField(field, value, data) {
    try {
      const resource = await this.model.findOneAndUpdate(
        { [field]: value },
        { ...data, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      
      return resource;
    } catch (error) {
      throw error;
    }
  }

  // Delete resource
  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete resource by custom field
  async deleteByField(field, value) {
    try {
      return await this.model.findOneAndDelete({ [field]: value });
    } catch (error) {
      throw error;
    }
  }

  // Bulk operations
  async bulkCreate(dataArray) {
    try {
      return await this.model.insertMany(dataArray);
    } catch (error) {
      throw error;
    }
  }

  async bulkUpdate(filter, update) {
    try {
      return await this.model.updateMany(filter, { ...update, updatedAt: Date.now() });
    } catch (error) {
      throw error;
    }
  }

  async bulkDelete(ids) {
    try {
      return await this.model.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw error;
    }
  }

  // Count resources
  async count(filter = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw error;
    }
  }

  // Check if resource exists
  async exists(filter) {
    try {
      const resource = await this.model.findOne(filter);
      return !!resource;
    } catch (error) {
      throw error;
    }
  }

  // Get distinct values
  async getDistinct(field, filter = {}) {
    try {
      return await this.model.distinct(field, filter);
    } catch (error) {
      throw error;
    }
  }

  // Aggregation operations
  async aggregate(pipeline) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }

  // Get basic statistics
  async getStats(queryString = {}) {
    try {
      const total = await this.count();
      
      // Get status distribution if status field exists
      let statusStats = [];
      try {
        statusStats = await this.model.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
      } catch (error) {
        // Status field might not exist, ignore error
      }
      
      // Get creation stats for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentCount = await this.count({
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      // Get daily creation stats for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const dailyStats = await this.model.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      return {
        total,
        recentCount,
        statusStats,
        dailyStats
      };
    } catch (error) {
      throw error;
    }
  }

  // Advanced statistics with custom aggregation
  async getAdvancedStats(pipeline = []) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }

  // Validation helpers
  async validateUnique(field, value, excludeId = null) {
    try {
      const filter = { [field]: value };
      if (excludeId) {
        filter._id = { $ne: excludeId };
      }
      
      const exists = await this.exists(filter);
      return !exists;
    } catch (error) {
      throw error;
    }
  }

  // Soft delete (if using soft delete pattern)
  async softDelete(id) {
    try {
      return await this.update(id, { 
        deleted: true, 
        deletedAt: new Date() 
      });
    } catch (error) {
      throw error;
    }
  }

  // Restore soft deleted resource
  async restore(id) {
    try {
      return await this.update(id, { 
        deleted: false, 
        deletedAt: null 
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BaseService;