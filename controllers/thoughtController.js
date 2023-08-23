const {Thought, User} = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'Not found with this ID!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: dbThoughtData._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought created, no user found with ID',
        });
      }
      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err)
    }
  },
  async updateThought (req, res){
    try{
        const dbThoughtData = await Thought.findOneAndUpdate({ _id: req.params.thoughtId },{ $set: req.body },{ runValidators: true, new: true })
        res.json(dbThoughtData)
    }catch(err){
        res.status(500).json(err)
    }
  },
  async createReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body} },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'Not found wit this ID!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err)
    }
  },
};