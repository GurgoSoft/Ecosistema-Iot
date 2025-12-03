/**
 * Modelo de Usuario
 * Define el esquema y métodos para la gestión de usuarios con Sequelize
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // Username - Campo único para login
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'El username ya está registrado'
    },
    validate: {
      notEmpty: { msg: 'El username es obligatorio' },
      len: { args: [3, 50], msg: 'El username debe tener entre 3 y 50 caracteres' },
      is: { 
        args: /^[a-zA-Z0-9_-]+$/, 
        msg: 'El username solo puede contener letras, números, guiones y guiones bajos sin espacios' 
      }
    }
  },
  
  // Campo legacy (se mantendrá hasta eliminar la columna de la BD)
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'User'
  },
  
  // Información personal
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'first_name',
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' },
      len: { args: [1, 50], msg: 'El nombre no puede exceder 50 caracteres' }
    }
  },
  
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'last_name',
    validate: {
      notEmpty: { msg: 'El apellido es obligatorio' },
      len: { args: [1, 50], msg: 'El apellido no puede exceder 50 caracteres' }
    }
  },
  
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'El email ya está registrado'
    },
    validate: {
      isEmail: { msg: 'Email inválido' },
      notEmpty: { msg: 'El email es obligatorio' }
    }
  },
  
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña es obligatoria' },
      len: { args: [8, 255], msg: 'La contraseña debe tener al menos 8 caracteres' },
      is: {
        args: /^(?=.*[!@#$%^&*])/,
        msg: 'La contraseña debe contener al menos un carácter especial'
      }
    }
  },
  
  // Información institucional
  areaOfWork: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'area_of_work',
    validate: {
      notEmpty: { msg: 'El área de trabajo es obligatoria' },
      isIn: {
        args: [['technology', 'manufacturing', 'healthcare', 'education', 'finance', 'agriculture', 'energy', 'transportation', 'other']],
        msg: 'Área de trabajo inválida'
      }
    }
  },
  
  companyName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'company_name',
    validate: {
      notEmpty: { msg: 'El nombre de la compañía es obligatorio' },
      len: { args: [1, 100], msg: 'El nombre de la compañía no puede exceder 100 caracteres' }
    }
  },
  
  companyWebsite: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'company_website',
    validate: {
      notEmpty: { msg: 'El sitio web de la compañía es obligatorio' },
      isUrl: { msg: 'El sitio web debe ser una URL válida' }
    }
  },
  
  // Información de contacto
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  
  // Rol del usuario
  role: {
    type: DataTypes.ENUM('user', 'admin', 'viewer'),
    defaultValue: 'user',
    allowNull: false
  },
  
  // Estado de la cuenta
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  
  // Metadatos
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    // Hook: Encriptar password antes de crear
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Hook: Encriptar password antes de actualizar
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método de instancia: Comparar password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método de instancia: Obtener usuario sin password
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
