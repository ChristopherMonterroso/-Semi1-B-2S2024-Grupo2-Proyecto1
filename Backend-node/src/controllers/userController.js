const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

AWS.config.update({ 
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_COGNITO,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_COGNITO,
  region: process.env.AWS_REGION_COGNITO
})
const cognito = new AWS.CognitoIdentityServiceProvider();

const createUser = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios: nombre completo, email, contraseña.",
        status: false,
      });
    }

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({
        message: "El correo electrónico ya está registrado.",
        status: false,
      });
    }

    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: full_name,
        },
      ],
    };

    const cognitoResponse = await cognito.signUp(params).promise();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser,
      cognitoUserId: cognitoResponse.UserSub,
      status: true,
    });
    
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({
      message: 'Error en el registro de usuario',
      error: error.message,
      status: false,
    });
  }
};

const confirmUser = async (req, res) => {
  try {
    const { email, confirmationCode } = req.body;

    if (!email || !confirmationCode) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios: correo electrónico y código de confirmación.",
        status: false,
      });
    }

    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
    };

    const cognitoResponse = await cognito.confirmSignUp(params).promise();

    return res.status(200).json({
      message: 'Usuario confirmado exitosamente',
      cognitoResponse,
      status: true,
    });

  } catch (error) {
    console.error('Error al confirmar usuario:', error);
    return res.status(500).json({
      message: 'Error al confirmar usuario',
      error: error.message,
      status: false,
    });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "El correo electrónico y la contraseña son obligatorios",
        status: false,
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
        status: false,
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Contraseña incorrecta",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      },
      status: true,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
      status: false,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id_user } = req.params;

    const user = await User.findOne({ where: { user_id: id_user } });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Perfil del usuario obtenido con éxito",
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      },
      status: true,
    });
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
      status: false,
    });
  }
};

const updateUserProfile = async (req, res) => {
  const { id_user } = req.params;
  const { full_name } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: id_user } });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
        status: false,
      });
    }

    if (full_name) {
      user.full_name = full_name;

      const cognitoParams = {
        UserAttributes: [
          {
            Name: 'name',
            Value: full_name,
          },
        ],
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: user.email,
      };

      await cognito.adminUpdateUserAttributes(cognitoParams).promise();
    }

    await user.save();

    return res.status(200).json({
      message: "Perfil actualizado exitosamente",
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      },
      status: true,
    });
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario:", error);
    return res.status(500).json({
      message: "Error al actualizar el perfil",
      error: error.message,
      status: false,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id_user } = req.params;

  try {
    const user = await User.findOne({ where: { user_id: id_user } });

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
        status: false,
      });
    }

    const email = user.email; 

    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID, 
      Username: email, 
    };

    await cognito.adminDeleteUser(params).promise();

    await user.destroy();

    return res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      status: true,
    });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return res.status(500).json({
      message: 'Error al eliminar el usuario',
      error: error.message,
      status: false,
    });
  }
};

module.exports = {
  createUser,
  authUser,
  confirmUser,
  getUserProfile,
  updateUserProfile,
  deleteUser
};