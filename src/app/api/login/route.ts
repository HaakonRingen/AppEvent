import type { NextApiRequest, NextApiResponse } from "next";
import { loginUser } from "../../../backend/User/loginUser"; // Import from the backend folder

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const userData = req.body; // Extract user credentials from the request body
      const user = await loginUser(userData); // Call the loginUser function from backend

      if (user) {
        res.status(200).json({ message: "Innlogging vellykket!", user });
      } else {
        res.status(401).json({ error: "Feil e-post eller passord" });
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Noe gikk galt ved innlogging" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" }); // Handle non-POST requests
  }
}
