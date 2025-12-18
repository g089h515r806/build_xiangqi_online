

import express from 'express';
import { baseApi } from '../../config.js';
import userAccess from '../../middlewares/user-access.js';
import TaxonomyController from './taxonomy.controller.js';

const api = 'taxonomy';

const router = express.Router();

//router.prefix(`/${baseApi}/${api}`);

router.get(`/${baseApi}/${api}/termsbycodes`, TaxonomyController.findTermsByCodes);

//rest callback for vocabulary
// GET /api/taxonomy
router.get(`/${baseApi}/${api}`, userAccess('administer taxonomy'),  TaxonomyController.find);

// POST /api/taxonomy
router.post(`/${baseApi}/${api}`, userAccess('administer taxonomy'),  TaxonomyController.add);

// GET /api/taxonomy/id
router.get(`/${baseApi}/${api}/:id`, userAccess('administer taxonomy'), TaxonomyController.findById);

// PUT /api/taxonomy/id
router.put(`/${baseApi}/${api}/:id`, userAccess('administer taxonomy'), TaxonomyController.update);

// DELETE /api/taxonomy/id
router.delete(`/${baseApi}/${api}/:id`, userAccess('administer taxonomy'), TaxonomyController.delete);

//rest callback for term
// GET /api/taxonomy/:vid/terms
router.get(`/${baseApi}/${api}/:vid/terms`, userAccess('access term'), TaxonomyController.findTerms);

router.get(`/${baseApi}/${api}/terms/:code`, userAccess('access term'), TaxonomyController.findTermsByVocCode);

// POST /api/taxonomy/:vid/terms
router.post(`/${baseApi}/${api}/:vid/terms`, userAccess('create term'), TaxonomyController.addTerm);


// GET /api/taxonomy/term/id
router.get(`/${baseApi}/${api}/term/:id`, userAccess('access term'),  TaxonomyController.findTermById);

// PUT /api/taxonomy/term/id
router.put(`/${baseApi}/${api}/term/:id`, userAccess('edit term'), TaxonomyController.updateTerm);

// DELETE /api/taxonomy/term/id
router.delete(`/${baseApi}/${api}/term/:id`, userAccess('delete term'), TaxonomyController.deleteTerm);

export default router;
