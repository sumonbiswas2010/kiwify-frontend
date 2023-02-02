import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './components/Home/Home';
import InvoicePayment from './components/InvoicePayment/InvoicePayment';

import NotFound from './components/NotFound/NotFound';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/:invoice_id" element={<InvoicePayment />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
