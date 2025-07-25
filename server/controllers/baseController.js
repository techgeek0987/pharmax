class BaseController {
  constructor(service) {
    this.service = service;
  }

  // Get all resources with filtering, searching, sorting, and pagination
  async getAll(req, res) {
    try {
      const result = await this.service.getAll(req.query);
      
      res.status(200).json({
        success: true,
        message: `${this.service.modelName}s retrieved successfully`,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error(`Error getting ${this.service.modelName}s:`, error);
      res.status(500).json({
        success: false,
        message: `Error retrieving ${this.service.modelName}s`,
        error: error.message
      });
    }
  }

  // Get single resource by ID
  async getById(req, res) {
    try {
      const resource = await this.service.getById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${this.service.modelName} not found`
        });
      }

      res.status(200).json({
        success: true,
        message: `${this.service.modelName} retrieved successfully`,
        data: resource
      });
    } catch (error) {
      console.error(`Error getting ${this.service.modelName}:`, error);
      res.status(500).json({
        success: false,
        message: `Error retrieving ${this.service.modelName}`,
        error: error.message
      });
    }
  }

  // Create new resource
  async create(req, res) {
    try {
      const resource = await this.service.create(req.body);
      
      res.status(201).json({
        success: true,
        message: `${this.service.modelName} created successfully`,
        data: resource
      });
    } catch (error) {
      console.error(`Error creating ${this.service.modelName}:`, error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
      
      // Handle duplicate key errors
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Resource already exists',
          error: 'Duplicate key error'
        });
      }
      
      res.status(500).json({
        success: false,
        message: `Error creating ${this.service.modelName}`,
        error: error.message
      });
    }
  }

  // Update resource
  async update(req, res) {
    try {
      const resource = await this.service.update(req.params.id, req.body);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${this.service.modelName} not found`
        });
      }

      res.status(200).json({
        success: true,
        message: `${this.service.modelName} updated successfully`,
        data: resource
      });
    } catch (error) {
      console.error(`Error updating ${this.service.modelName}:`, error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
      
      res.status(500).json({
        success: false,
        message: `Error updating ${this.service.modelName}`,
        error: error.message
      });
    }
  }

  // Delete resource
  async delete(req, res) {
    try {
      const resource = await this.service.delete(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${this.service.modelName} not found`
        });
      }

      res.status(200).json({
        success: true,
        message: `${this.service.modelName} deleted successfully`
      });
    } catch (error) {
      console.error(`Error deleting ${this.service.modelName}:`, error);
      res.status(500).json({
        success: false,
        message: `Error deleting ${this.service.modelName}`,
        error: error.message
      });
    }
  }

  // Get resource statistics
  async getStats(req, res) {
    try {
      const stats = await this.service.getStats(req.query);
      
      res.status(200).json({
        success: true,
        message: `${this.service.modelName} statistics retrieved successfully`,
        data: stats
      });
    } catch (error) {
      console.error(`Error getting ${this.service.modelName} stats:`, error);
      res.status(500).json({
        success: false,
        message: `Error retrieving ${this.service.modelName} statistics`,
        error: error.message
      });
    }
  }

  // Bulk operations
  async bulkCreate(req, res) {
    try {
      const resources = await this.service.bulkCreate(req.body);
      
      res.status(201).json({
        success: true,
        message: `${this.service.modelName}s created successfully`,
        data: resources
      });
    } catch (error) {
      console.error(`Error bulk creating ${this.service.modelName}s:`, error);
      res.status(500).json({
        success: false,
        message: `Error bulk creating ${this.service.modelName}s`,
        error: error.message
      });
    }
  }

  async bulkUpdate(req, res) {
    try {
      const result = await this.service.bulkUpdate(req.body.filter, req.body.update);
      
      res.status(200).json({
        success: true,
        message: `${this.service.modelName}s updated successfully`,
        data: result
      });
    } catch (error) {
      console.error(`Error bulk updating ${this.service.modelName}s:`, error);
      res.status(500).json({
        success: false,
        message: `Error bulk updating ${this.service.modelName}s`,
        error: error.message
      });
    }
  }

  async bulkDelete(req, res) {
    try {
      const result = await this.service.bulkDelete(req.body.ids);
      
      res.status(200).json({
        success: true,
        message: `${this.service.modelName}s deleted successfully`,
        data: result
      });
    } catch (error) {
      console.error(`Error bulk deleting ${this.service.modelName}s:`, error);
      res.status(500).json({
        success: false,
        message: `Error bulk deleting ${this.service.modelName}s`,
        error: error.message
      });
    }
  }
}

module.exports = BaseController;