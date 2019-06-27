const sha256 = require("js-sha256");
const uid2 = require("uid2");
const Event = require("../../models/event");
const User = require("../../models/user");

//Populate() manuellement avec des fonctions
const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    const eventsPopulated = events.map(event => {
      return { ...event._doc, creator: creator(event.creator) };
    });
    return eventsPopulated;
  } catch (error) {
    throw error;
  }
};

const creator = async userId => {
  try {
    const creator = await User.findById(userId);
    return { ...creator._doc, createdEvents: events(creator.createdEvents) };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  // need to add try/catch
  events: async () => {
    const events = await Event.find();
    const eventsPopulated = events.map(event => {
      return { ...event._doc, creator: creator(event.creator) };
    });
    return eventsPopulated;
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5d1394129d26ed0be393093d"
    });
    await event.save();
    const user = await User.findById("5d1394129d26ed0be393093d");
    user.createdEvents.push(event);
    await user.save();
    return { ...event._doc, creator: creator("5d1394129d26ed0be393093d") };
  },
  createUser: async args => {
    try {
      if (!(await User.findOne({ email: args.userInput.email }))) {
        const hash = sha256(args.userInput.password + uid2(12));
        const user = new User({
          email: args.userInput.email,
          password: hash
        });
        await user.save();
        user.password = null;
        return user;
      }
      throw new Error("User exists already");
    } catch (error) {
      throw error;
    }
  }
};
