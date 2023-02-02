import logo from './logo.svg';
import successImg from './payment-success.png';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    return (
        <div className="ayment-success-main">
            <div className="ayment-success-area">
                <div className="payment-success">
                    <div>
                        <img width="160px" src={logo} alt="" />
                    </div>
                    <div>
                        <img src={successImg} alt="" />
                    </div>
                    <h3>Payment successful</h3>
                    <p>Congratulations on your successful payment</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
