import { Request, Response } from "express";
import { Pmsg, IPmsg } from "../models/pmsgs.model";
import { User } from "~/models/users.model";
import { Guest } from "~/models/guests.model";
import { Message } from "~/models/messages.model";

// GET /pmsgs
// Get all private messages
export const getPmsgs = async (req: Request, res: Response) => {
  try {
    const pmsgs = await Pmsg.find();
    res.status(200).json(pmsgs);
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /pmsgs/:id
// Get a private message by id
export const getPmsg = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pmsg = await Pmsg.findById(id);

    if (!pmsg) {
      res.status(404).json({ message: "Pmsg not found" });
      return;
    }

    res.status(200).json(pmsg);
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /pmsgs
// Create a new private message
export const createPmsg = async (req: Request, res: Response) => {
  try {
    const { members } = req.body;

    if (!members || members.length !== 2) {
      res.status(400).json({ message: "2 users are required" });
    }

    let membersUsername: string[] = [];
    for (let i = 0; i < members.length; i++) {
      const user = await User.findById(members[i]);
      const guest = await Guest.findById(members[i]);

      if (!user && !guest) {
        res.status(404).json({ message: "Member not found" });
      } else if (user && !guest) {
        membersUsername.push(user.username);
      } else if (!user && guest) {
        membersUsername.push(guest.username);
      }
    }

    const data: IPmsg = {
      name: `${membersUsername[0]}-${membersUsername[1]}`,
      members: members,
    };

    const pmsg = new Pmsg(data);
    const savedPmsg: IPmsg = await pmsg.save();

    const updatedMembers = []
    if (typeof savedPmsg._id == "object") {
      for (let i = 0; i < members.length; i++) {
        const user = await User.findById(members[i]);
        const guest = await Guest.findById(members[i]);

        if (!user && !guest) {
          res.status(404).json({ message: "Member not found" });
        } else if (user && !guest) {
          user.pmsgs.push(savedPmsg._id);
          updatedMembers.push(await user.save());
        } else if (!user && guest) {
          guest.pmsgs.push(savedPmsg._id);
          updatedMembers.push(await guest.save());
        }
      }
    }

    res.status(201).json({pmsg: savedPmsg, members: updatedMembers});
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /pmsgs:id
// Delete a private message
export const deletePmsg = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pmsg = await Pmsg.findById(id);

    if (!pmsg) {
      res.status(404).json({ message: "Pmsg not found" });
      return;
    }

    const messages = await Message.find({ channelId: id });

    if (!messages) {
      res.status(404).json({ message: "Messages related to pmsg not found" });
      return;
    }

    for (let i = 0; i < messages.length; i++) {
      await Message.findByIdAndDelete(messages[i]._id);
    }

    for (let i = 0; i < pmsg.members.length; i++) {
      const member = await User.findById(pmsg.members[i]);
      const guest = await Guest.findById(pmsg.members[i]);

      console.log(pmsg.members.length, " | ", member, guest)
      if (member && !guest) {
        const memberIndex = member.pmsgs.indexOf(id);
        if (memberIndex === -1) {
          res.status(404).json({ message: "Pmsg not found in member" });
          return;
        }

        member.pmsgs.splice(memberIndex, 1);
        await member.save();
      } else if (guest) {
        const guestIndex = guest.pmsgs.indexOf(id);
        if (guestIndex === -1) {
          res.status(404).json({ message: "Pmsg not found in guest" });
          return;
        }

        guest.pmsgs.splice(guestIndex, 1);
        await guest.save();
      }
    }

    const deletedPmsg = await Pmsg.findByIdAndDelete(id);

    if (!deletedPmsg) {
      res.status(404).json({ message: "Pmsg not found"});
    }

    res.status(200).json({ message: "Pmsg deleted"});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
