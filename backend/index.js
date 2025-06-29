require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECTION_STRING);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full name is required" });
    }

    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res
            .status(409)
            .json({ error: true, message: "User already exist" });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res
            .status(400)
            .json({ error: true, message: "Invalid Credentials" });
    }
});

app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            _id: isUser._id,
            fullName: isUser.fullName,
            email: isUser.email,
            createdOn: isUser.createdOn,
        },
        message: "",
    });
});

app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags, bgColor } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    if (!bgColor) {
        return res.status(400).json({ error: true, message: "Color is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            bgColor,
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
    }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned, bgColor } = req.body;
    const { user } = req.user;

    if (
        typeof title === "undefined" &&
        typeof content === "undefined" &&
        typeof tags === "undefined" &&
        typeof isPinned === "undefined" &&
        typeof bgColor === "undefined"
    ) {
        return res
            .status(400)
            .json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res
                .status(404)
                .json({ error: true, message: "Note not found" });
        }

        let updated = false;

        if (typeof title !== "undefined" && note.title !== title) {
            note.title = title;
            updated = true;
        }

        if (typeof content !== "undefined" && note.content !== content) {
            note.content = content;
            updated = true;
        }

        if (
            typeof tags !== "undefined" &&
            JSON.stringify(note.tags) !== JSON.stringify(tags)
        ) {
            note.tags = tags;
            updated = true;
        }

        if (typeof isPinned !== "undefined" && note.isPinned !== isPinned) {
            note.isPinned = isPinned;
            updated = true;
        }

        if (typeof bgColor !== "undefined" && note.bgColor !== bgColor) {
            note.bgColor = bgColor;
            updated = true;
        }

        if (updated) {
            await note.save();
            return res.json({
                error: false,
                note,
                message: "Note updated successfully",
            });
        } else {
            return res
                .status(400)
                .json({ error: true, message: "No changes provided" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
    }
});

app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
    }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res
                .status(400)
                .json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
    }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (note.isPinned === isPinned) {
            return res.status(400).json({
                error: true,
                message: "No changes provided",
            });
        }

        note.isPinned = isPinned;
        await note.save();

        return res.json({
            error: false,
            note,
            message: isPinned
                ? "Note pinned successfully"
                : "Note unpinned successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.get("/search-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
        return res
            .status(400)
            .json({ error: true, message: "Search query is required" });
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
    }
});

app.get("/ping", (req, res) => {
  res.status(200).send("Ping");
});

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;