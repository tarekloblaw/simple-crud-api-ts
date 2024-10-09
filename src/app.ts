import express from 'express';
import bodyParser from 'body-parser';
import expenseRoutes from './routes/expenseRoutes';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/expenses', expenseRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
