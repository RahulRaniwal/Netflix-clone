import bcrypt from "bcrypt";
import { NextApiRequest , NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  // limit this handler to post call only
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

  try {
    const { email, password, username } = req.body; // extract data from req body

    // check if a user already exists or not
    const existingUser = await prismadb.user.findUnique({
      where:{email}
    })

    if(existingUser){
      return res.status(409).json({ error: "User with the email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password , 12);

    // create a new user
    const user = await prismadb.user.create({
      data:{
        email,
        name: username,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
      }
    })

    return res.status(200).json(user);

  } catch (err:any) {
    console.error("Error creating user:", err.message); // err.message logs the specific error
    return res.status(500).json({ error: "Internal Server Error" });
  }

}