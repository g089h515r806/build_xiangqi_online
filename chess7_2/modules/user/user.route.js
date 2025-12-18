'use strict';

import express from 'express';
import userAccess from '../../middlewares/user-access.js';
import UserController from './user.controller.js';

const router = express.Router();

//const api = 'user';

//const router = new Router();

//router.prefix(`/${baseApi}/${api}`);

// GET /api/roles
router.get('/api/user/role', userAccess('access role'), UserController.findRole);

router.post('/api/user/role', userAccess('create role'), UserController.addRole);

router.get('/api/user/role/:id', userAccess('access role'), UserController.findRoleById);

router.put('/api/user/role/:id', userAccess('edit role'), UserController.updateRole);

router.delete('/api/user/role/:id', userAccess('delete role'), UserController.deleteRole);

router.get('/api/user/permissions', UserController.findAllPermissions);

// GET /api/user
router.get('/api/user', userAccess('access user'), UserController.find);
router.post('/api/user/login', UserController.login);
//router.post('/register', UserController.register);
//router.post('/admin/register', UserController.adminRegister);

// POST /api/user
router.post('/api/user', userAccess('create user'), UserController.add);

// GET /api/user/id
router.get('/api/user/:id', userAccess('access user'), UserController.findById);

// PUT /api/user/id
router.put('/api/user/:id', userAccess('edit user'), UserController.update);

// DELETE /api/user/id
// This route is protected, call POST /api/authenticate to get the token
router.delete('/api/user/:id', userAccess('delete user'), UserController.delete);
	

export default router;
