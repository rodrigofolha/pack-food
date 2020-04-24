const Yup = require('yup');
const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');

module.exports = {
  async store(req, res) {
    const restaurant_id = req.userId;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
      delivery_price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Form validation error' });
    }

    const logo = req.files['logo'][0];
    const banner = req.files['banner'][0];

    const { description, delivery_price } = req.body;

    const menu = await Menu.create({
      restaurant_id,  
      description,
      delivery_price,
      logo_path: logo.filename,
      banner_path: banner.filename
    });

    const restaurant = await Restaurant.findOne({
      where: { id: restaurant_id }
    });

    const update = await restaurant.update({
      active: true
    });
    console.log(update);

    return res.json(menu);
  }, 

  async update(req, res) {
    const restaurant_id = req.userId;

    const schema = Yup.object().shape({
      description: Yup.string(),
      delivery_price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Form validation error' });
    }

    const menu = await Menu.findOne({
      where: { restaurant_id }
    });

    const updates = {
      description: req.body.description,
      delivery_price: req.body.delivery_price,
    }

    if (req.files['logo']) {
      const logo = req.files['logo']
      updates.logo = logo; 
    }

    if (req.files['banner']) {
      const banner = req.files['banner']
      updates.banner = banner;
    }

    const update = await menu.update(updates);

    return res.json(update);
  },

  async index(req, res) {
    const restaurant_id = req.userId;

    const menu = await Menu.findOne({
      where: { restaurant_id }
    });

    return res.json(menu);
  }
}