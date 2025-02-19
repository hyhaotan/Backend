import Contact from "../model/contact";

export const contact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const newContact = new Contact({ name, email, message });

        await newContact.save();

        res.status(201).json({ message: "Contact saved successfully" });
    } catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).json({ error: "An error occurred while saving the contact" });
    }
};