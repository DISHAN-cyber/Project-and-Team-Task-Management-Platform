import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`TaskFlow API listening on http://localhost:${PORT}`);
});
