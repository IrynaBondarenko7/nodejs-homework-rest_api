// const fs = require("node:fs/promises");
// const path = require("node:path");
// const crypto = require("node:crypto");

// const contactsPath = path.join(__dirname, "contacts.json");

// async function readContacts() {
//   const data = await fs.readFile(contactsPath, "utf-8");
//   return JSON.parse(data);
// }
// async function writeContacts(contacts) {
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
// }

// const listContacts = async () => {
//   const contacts = await readContacts();
//   return contacts;
// };

// const getContactById = async (contactId) => {
//   const contacts = await readContacts();
//   const contact = contacts.find((contact) => contact.id === contactId);
//   return contact || null;
// };

// const addContact = async (body) => {
//   const contacts = await readContacts();
//   const { name, email, phone } = body;
//   const contact = {
//     id: crypto.randomUUID(),
//     name,
//     email,
//     phone,
//   };

//   contacts.push(contact);

//   await writeContacts(contacts);
//   return contact;
// };

// const removeContact = async (contactId) => {
//   const contacts = await readContacts();
//   const index = contacts.findIndex((contact) => contact.id === contactId);
//   const newContacts = [
//     ...contacts.slice(0, index),
//     ...contacts.slice(index + 1),
//   ];
//   await writeContacts(newContacts);
//   return "Success removing";
// };

// const updateContact = async (contactId, body) => {
//   const contacts = await readContacts();
//   const index = contacts.findIndex((contact) => contact.id === contactId);
//   if (index === -1) {
//     return null;
//   }

//   contacts[index] = { id: contactId, ...body };
//   await writeContacts(contacts);
//   return contacts[index];
// };

// module.exports = {
//   listContacts,
//   getContactById,
//   addContact,
//   removeContact,
//   updateContact,
// };
