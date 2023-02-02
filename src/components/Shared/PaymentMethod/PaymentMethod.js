import './PaymentMethod.css';

const PaymentMethod = ({ icon, name, onClick, className }) => {
    return (
        <div className={`payment-method ${className}`} onClick={onClick}>
            <img src={icon} alt="" />
            <span>{name}</span>
        </div>
    );
};

export default PaymentMethod;
