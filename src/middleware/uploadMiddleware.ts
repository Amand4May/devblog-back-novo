import multer from 'multer';
import path from 'path';

// onde e como salvar os arquivos
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // salvando em uploads na raiz do projeto
  },

  filename: (req, file, cb) => {
    // nome com timestamp, para nao duplicar
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
  
});

export const upload = multer({ storage });