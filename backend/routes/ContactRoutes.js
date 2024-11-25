import { Router } from "express";
import {verifyToken} from '../middlewares/AuthMiddleware.js'
import {  getContactsForDMLIst, searchContacts } from "../controllers/ContactsControllers.js";


const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts)
contactRoutes.get("/get-contacts-for-dm",  verifyToken, getContactsForDMLIst)
// contactRoutes.get("/get-all-contacts", verifyToken, getAllContacts)

export default contactRoutes