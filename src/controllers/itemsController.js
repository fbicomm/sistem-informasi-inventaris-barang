const { promisify } = require('util');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const QRCode = require('qrcode');
const multer = require('multer');
const path = require('path');
// const { createCanvas } = require("canvas");
// const JsBarcode = require("jsbarcode");
const stockItemsQuery = require('../queries/stockItemsQuery');
const itemsIncomingQuery = require('../queries/itemsIncomingQuery');
const itemsWithdrawalQuery = require('../queries/itemsWithdrawalQuery');

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Delete File
const unlinkAsync = promisify(fs.unlink);

// Canvas
// const canvas = createCanvas();

const getItems = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const items = await stockItemsQuery.getItems();
    res.render('items', {
      user: req.session.user.email,
      title: 'Items Stock ',
      items: items,
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const items = await stockItemsQuery.getItems();
    res.render('items', {
      us: req.session.user.email,
      title: 'Items Stock ',
      items: items,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const getItemsDetail = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const items = await stockItemsQuery.getDetail(req.params.id);
    const itemsIncoming = await itemsIncomingQuery.getDetailItems(req.params.id);
    const itemsWithdrawal = await itemsWithdrawalQuery.getDetailItems(req.params.id);

    res.render('itemsDetail', {
      items: items,
      user: req.session.user.email,
      title: 'Items Detail',
      itemsi: itemsIncoming,
      itemsw: itemsWithdrawal,
      moment,
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const items = await stockItemsQuery.getDetail(req.params.id);
    const itemsIncoming = await itemsIncomingQuery.getDetailItems(req.params.id);
    const itemsWithdrawal = await itemsWithdrawalQuery.getDetailItems(req.params.id);

    res.render('itemsDetail', {
      items: items,
      us: req.session.user.email,
      title: 'Items Detail',
      itemsi: itemsIncoming,
      itemsw: itemsWithdrawal,
      moment,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const addItems = [
  upload.single('image'),
  body('codeitems').custom(async (value) => {
    const dup = await stockItemsQuery.verifyCode(value.toLowerCase());
    if (dup) {
      throw new Error('Add items failed: código already exists.');
    }
    return true;
  }),
  body('nameitems').custom(async (value) => {
    const duplicate = await stockItemsQuery.verifyItems(value.toLowerCase());
    if (duplicate) {
      throw new Error('Add items failed: nome already exists.');
    }
    return true;
  }),
  body('image').custom(async (value, { req }) => {
    const maxSize = 10485760;
    if (req.file.size > maxSize) {
      throw new Error('Add items failed: file size exceeds 10MB limit.');
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === 'superadmin') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const img = req.file.filename;

        const imgPath = `./public/uploads/${img}`;
        if (fs.existsSync(imgPath)) {
          await unlinkAsync(imgPath);
        }

        const items = await stockItemsQuery.getItems();

        res.render('items', {
          title: 'Items Stock ',
          errors: errors.array(),
          user: req.session.user.email,
          items: items,
        });
      } else {
        const { nameitems } = req.body;
        const { description } = req.body;
        const { stock } = req.body;
        const image = req.file.filename;
        const input = req.session.user.email;
        const { codeitems } = req.body;

        await stockItemsQuery.addItems(
          nameitems,
          description,
          stock,
          image,
          input,
          codeitems,
        );

        // JsBarcode(canvas, codeitems);
        // const buffer = canvas.toBuffer("image/png");
        const writeImgPath = `./public/uploads/${codeitems}.png`;
        // fs.writeFileSync(writeImgPath, buffer);
        QRCode.toFile(writeImgPath, codeitems, (err) => {
          if (err) {
            console.err(err);
            return false;
          }
          return true;
        });

        res.redirect('/items');
      }
    } else if (req.session.user && req.session.user.role === 'user') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const img = req.file.filename;

        const imgPath = `./public/uploads/${img}`;
        if (fs.existsSync(imgPath)) {
          await unlinkAsync(imgPath);
        }

        const items = await stockItemsQuery.getItems();

        res.render('items', {
          title: 'Items Stock ',
          errors: errors.array(),
          us: req.session.user.email,
          items: items,
        });
      } else {
        const { nameitems } = req.body;
        const { description } = req.body;
        const { stock } = req.body;
        const image = req.file.filename;
        const input = req.session.user.email;
        const { codeitems } = req.body;

        await stockItemsQuery.addItems(
          nameitems,
          description,
          stock,
          image,
          input,
          codeitems,
        );

        // JsBarcode(canvas, codeitems);
        // const buffer = canvas.toBuffer("image/png");
        const writeImgPath = `./public/uploads/${codeitems}.png`;
        // fs.writeFileSync(writeImgPath, buffer);
        QRCode.toFile(writeImgPath, codeitems, (err) => {
          if (err) {
            console.err(err);
            return false;
          }
          return true;
        });

        res.redirect('/items');
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const updateItems = [
  upload.single('image'),
  body('codeitems').custom(async (value, { req }) => {
    const dup = await stockItemsQuery.checkCodeDuplicate(value.toLowerCase());
    if (value !== req.body.oldcode && dup) {
      throw new Error('Edit items failed: código already exists.');
    }
    return true;
  }),
  body('nameitems').custom(async (value, { req }) => {
    const duplicate = await stockItemsQuery.checkDuplicate(value.toLowerCase());
    if (value !== req.body.oldNama && duplicate) {
      throw new Error('Edit items failed: nome already exists.');
    }
    return true;
  }),
  body('image').custom(async (value, { req }) => {
    const maxSize = 10485760;
    if (req.file) {
      if (req.file.size > maxSize) {
        throw new Error('Edit items failed: file size exceeds 10MB limit.');
      }
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === 'superadmin') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.file && req.file.filename) {
          const img = req.file.filename;

          const imgPath = `./public/uploads/${img}`;
          if (fs.existsSync(imgPath)) {
            await unlinkAsync(imgPath);
          }
        }
        const items = await stockItemsQuery.getItems();

        res.render('items', {
          title: 'Items Stock ',
          errors: errors.array(),
          items: items,
          user: req.session.user.email,
        });
      } else if (req.file && req.file.filename) {
        const { nameitems } = req.body;
        const { description } = req.body;
        const { stock } = req.body;
        const image = req.file.filename;
        const { codeitems } = req.body;
        const { oldcode } = req.body;
        const { iditems } = req.body;
        const img = req.body.image;

        await stockItemsQuery.updateItems(
          nameitems,
          description,
          stock,
          image,
          codeitems,
          iditems,
        );

        const imgPath = `./public/uploads/${img}`;
        if (fs.existsSync(imgPath)) {
          await unlinkAsync(imgPath);
        }

        if (codeitems !== oldcode) {
          const oldImgPath = `./public/uploads/${oldcode}.png`;
          if (fs.existsSync(oldImgPath)) {
            await unlinkAsync(oldImgPath);
          }

          // JsBarcode(canvas, codeitems);
          // const buffer = canvas.toBuffer("image/png");
          const writeImgPath = `./public/uploads/${codeitems}.png`;
          // fs.writeFileSync(writeImgPath, buffer);
          QRCode.toFile(writeImgPath, codeitems, (err) => {
            if (err) {
              console.err(err);
              return false;
            }
            return true;
          });
        }

        res.redirect('/items');
      } else {
        const { nameitems } = req.body;
        const { description } = req.body;
        const { stock } = req.body;
        const { image } = req.body;
        const { codeitems } = req.body;
        const { oldcode } = req.body;
        const { iditems } = req.body;

        await stockItemsQuery.updateItems(
          nameitems,
          description,
          stock,
          image,
          codeitems,
          iditems,
        );

        if (codeitems !== oldcode) {
          const oldImgPath = `./public/uploads/${oldcode}.png`;
          if (fs.existsSync(oldImgPath)) {
            await unlinkAsync(oldImgPath);
          }

          // JsBarcode(canvas, codeitems);
          // const buffer = canvas.toBuffer("image/png");
          const writeImgPath = `./public/uploads/${codeitems}.png`;
          // fs.writeFileSync(writeImgPath, buffer);
          QRCode.toFile(writeImgPath, codeitems, (err) => {
            if (err) {
              console.err(err);
              return false;
            }
            return true;
          });
        }

        res.redirect('/items');
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const deleteItems = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const image = await stockItemsQuery.getImage(req.params.id);
    const code = await stockItemsQuery.getCode(req.params.id);
    await stockItemsQuery.delItems(req.params.id);
    // await itemsIncomingQuery.delitemsIncomingId(req.params.id);
    // await itemsWithdrawalQuery.delitemsWithdrawalId(req.params.id);
    const imgPath = `./public/uploads/${image}`;
    if (fs.existsSync(imgPath)) {
      await unlinkAsync(imgPath);
    }
    const writeImgPath = `./public/uploads/${code}.png`;
    if (fs.existsSync(writeImgPath)) {
      await unlinkAsync(writeImgPath);
    }
    res.redirect('/items');
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

module.exports = {
  getItems,
  getItemsDetail,
  addItems,
  updateItems,
  deleteItems,
};
