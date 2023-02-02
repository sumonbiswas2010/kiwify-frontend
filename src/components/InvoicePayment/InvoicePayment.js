import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shimmer } from 'react-shimmer';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import appleIcon from '../../images/apple.svg';
import arrowIcon from '../../images/arrow-down.svg';
import cardIcon from '../../images/credit-card.svg';
import googleIcon from '../../images/google.svg';
import infoIcon from '../../images/info-icon.svg';
import logo from '../../images/logo.svg';
import paypalIcon from '../../images/paypal.svg';
import Loading from '../Loading/Loading';
import PaymentSuccess from '../PaymentSuccess/PaymentSuccess';
import PaymentMethod from '../Shared/PaymentMethod/PaymentMethod';
import './InvoicePayment.css';

const InvoicePayment = () => {
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [isLoadingApi, setIsLoadingApi] = useState(false);
    const [card, setCard] = useState(false);
    const [viewInvoice, setViewInvoice] = useState(false);
    const [closingTable, setClosingTable] = useState(false);
    const [rotateIcon, setRotateIcon] = useState(false);
    const { invoice_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isInvoiceError, setInvoiceError] = useState(false);
    const [gatewayFees, setGatewayFees] = useState();
    const [invoiceData, setInvoiceData] = useState({
        amount: 0,
        due_date: 0,
        description: '',
        note: ''
    });
    const [invoiceItemFields, setInvoiceItemFields] = useState();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
    const setIsLoadingApiFromChild = (x) => setIsLoadingApi(x);
    const [gatewayFee, setGatewayFee] = useState(0);
    const [msg, setMsg] = useState();
    const [feeText, setFeeText] = useState();

    useEffect(() => {
        if (!invoiceData || !gatewayFees) return;
        if (selectedPaymentMethod === 'paypal') {
            setGatewayFee(invoiceData.paypal_gateway_fee);
            setFeeText(
                `Paypal payment gateway fee   ${gatewayFees.paypal.value}${
                    gatewayFees.paypal.fee_type === 'Percentage' ? '%' : ''
                }`
            );
        } else {
            setGatewayFee(invoiceData.stripe_gateway_fee);
            setFeeText(
                `${
                    selectedPaymentMethod === 'apple'
                        ? 'Apple Pay'
                        : selectedPaymentMethod === 'google'
                        ? 'Google Pay'
                        : 'Card'
                } payment gateway fee  ${gatewayFees.stripe.value}${
                    gatewayFees.stripe.fee_type === 'Percentage' ? '%' : ''
                }`
            );
        }
    }, [selectedPaymentMethod]);

    const getInvoiceData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/invoice/${invoice_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.json();
            setMsg(responseData.message);
            setIsLoading(false);

            if (response.ok) {
                if (responseData.data.length === 0) {
                    setInvoiceError(true);
                    setMsg(responseData.message);
                    return;
                }
                setInvoiceData(responseData.data);

                const now = new Date();
                const due = new Date(responseData.data.due_date);
                if (responseData.data.isPaid) {
                    setInvoiceError(true);
                    setMsg('Invoice Paid Already');
                    return;
                }
                if (now > due) {
                    setInvoiceError(true);
                    setMsg('Invoice Expired');
                    return;
                }
            } else {
                setInvoiceError(true);
                setMsg(responseData.message);
            }
        } catch (err) {
            setMsg('Failed: ' + err.message);
        }
        setIsLoading(false);
    };
    const getGatewayFees = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/gateway_fee`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.json();

            if (response.ok) {
                const stripe = responseData.data.find(
                    (data, i) => data?.payment_method.method_name === 'Stripe'
                );
                const paypal = responseData.data.find(
                    (data, i) => data?.payment_method.method_name === 'Paypal'
                );

                setGatewayFees({
                    stripe: {
                        fee_type: stripe.fee_type,
                        value: stripe.value
                    },
                    paypal: {
                        fee_type: paypal.fee_type,
                        value: paypal.value
                    }
                });
            } else {
            }
        } catch (err) {
            setMsg('Failed: ' + err.message);
        }
    };

    useEffect(() => {
        getInvoiceData();
        getGatewayFees();
    }, [invoice_id]);

    useEffect(() => {
        document.title = 'Payment Invoice';
    });
    const closeInvoiceBox = () => {
        setClosingTable(true);
        setTimeout(() => {
            setViewInvoice(false);
            setRotateIcon(!rotateIcon);
        }, 185);
    };

    const openInvoiceBox = () => {
        setViewInvoice(true);
        setClosingTable(false);
        setRotateIcon(!rotateIcon);
    };

    useEffect(() => {
        if (!invoiceData) return;
        if (invoiceData.items && invoiceData.items.length > 0) {
            setInvoiceItemFields(
                invoiceData.items.map((data) => (
                    <tr key={data.id}>
                        <td>{data.name}</td>
                        <td>{data.quantity}</td>
                        <td>${data.price}</td>
                        <td>${(data.price * data.quantity).toFixed(2)}</td>
                    </tr>
                ))
            );
        }
    }, [invoiceData]);
    return (
        <div className="invoice-payment-main">
            {isPaymentSuccess && <PaymentSuccess />}
            {!isPaymentSuccess && (
                <div className="invoice-payment-area">
                    {isLoadingApi && <Loading />}
                    {
                        <div>
                            <div className="invoice-payment-top">
                                <div>
                                    <img width="180px" src={logo} alt="" />
                                </div>
                                <div>
                                    <label>Invoice ID : #{invoice_id}</label>
                                </div>
                            </div>
                            <div className="invoice-payment">
                                {isLoading ? (
                                    <>
                                        <Shimmer
                                            className="shimmer"
                                            width={'300px'}
                                            height={'37px'}
                                        />
                                        <br></br>
                                        <Shimmer
                                            className="shimmer"
                                            width={'250px'}
                                            height={'27px'}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className="invoice-payment-left">
                                            <h3>Invoice For</h3>
                                            <h2>Client: {invoiceData.client_name}</h2>
                                        </div>
                                        <div className="invoice-payment-right">
                                            <h5>Amount Due</h5>
                                            <h2>{invoiceData.amount.toFixed(2)} USD</h2>
                                            <p>
                                                <span>Due Date : </span>
                                                <span>
                                                    {moment(
                                                        !isInvoiceError
                                                            ? new Date(invoiceData.due_date)
                                                            : new Date(),
                                                        'MMDDYYYY'
                                                    ).format('Do MMMM YYYY')}
                                                </span>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="view-invoice-area">
                                {isLoading ? (
                                    <Shimmer className="shimmer" width={'100%'} height={'62px'} />
                                ) : (
                                    <div
                                        className={
                                            closingTable
                                                ? 'close-invoice-table'
                                                : 'view-invoice-box'
                                        }
                                    >
                                        <div
                                            className="view-invoice"
                                            onClick={() =>
                                                viewInvoice ? closeInvoiceBox() : openInvoiceBox()
                                            }
                                        >
                                            <span>View Invoice</span>
                                            <span>
                                                <img
                                                    className={
                                                        !rotateIcon
                                                            ? 'close-invoice-icon'
                                                            : 'open-invoice-icon'
                                                    }
                                                    src={arrowIcon}
                                                    alt=""
                                                />
                                            </span>
                                        </div>

                                        {viewInvoice && (
                                            <div className="view-invoice-table">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Item</th>
                                                            <th>Qty</th>
                                                            <th>Price</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {invoiceItemFields}
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Total Amount: </td>
                                                            <td>
                                                                <strong>
                                                                    ${invoiceData.amount.toFixed(2)}
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div className="invoice-description-area">
                                                    <div className="invoice-description">
                                                        <h5>Description</h5>
                                                        <p>{invoiceData.description}</p>
                                                    </div>
                                                    <div
                                                        className="invoice-description"
                                                        style={{ margin: '0' }}
                                                    >
                                                        <h5>Additional Notes</h5>
                                                        <p>{invoiceData.note}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <br></br>
                                {isInvoiceError && <h3>{msg}</h3>}
                            </div>

                            {/* <div className="paying-fee-area">
                                <h4>Who is paying the fee?</h4>
                                <div className="paying-button">
                                    <button
                                        onClick={(e) => setIsClient(true)}
                                        className={isClient ? 'btn-active' : ''}
                                    >
                                        Freelancer
                                    </button>
                                    <button
                                        onClick={() => setIsClient(false)}
                                        className={isClient ? '' : 'btn-active'}
                                    >
                                        Client
                                    </button>
                                </div>
                            </div> */}
                            {selectedPaymentMethod && (
                                <div className="paying-fee-table">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: 'left' }}>
                                                    Invoice Payment
                                                </td>
                                                <td style={{ textAlign: 'center' }}>&nbsp;</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {invoiceData.amount?.toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'left' }}>Gateway Fee</td>
                                                <td style={{ textAlign: 'center' }}>&nbsp;</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {gatewayFee?.toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr style={{ borderTop: '1px solid #ddd' }}>
                                                <td style={{ textAlign: 'left' }}>
                                                    <b>Total</b>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>&nbsp;</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <b>
                                                        {(invoiceData.amount + gatewayFee)?.toFixed(
                                                            2
                                                        )}
                                                    </b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {selectedPaymentMethod && (
                                <p
                                    style={{
                                        display: 'flex',
                                        margin: '0',
                                        fontSize: '18px',
                                        color: '#04041599',
                                        fontWeight: '500'
                                    }}
                                >
                                    <span style={{ marginRight: '3px' }}>
                                        <img src={infoIcon} alt="" />
                                    </span>
                                    <span>{feeText}.</span>
                                </p>
                            )}
                            {!isInvoiceError && (
                                <>
                                    <div className="payment-method-area">
                                        {isLoading ? (
                                            <>
                                                <Shimmer
                                                    className="shimmer payment-method-title-shimmer"
                                                    width={'100%'}
                                                    height={'30px'}
                                                />
                                                <div className="all-paycard">
                                                    <Shimmer
                                                        className="shimmer paycard"
                                                        width={'135px'}
                                                        height={'55px'}
                                                    />
                                                    <Shimmer
                                                        className="shimmer paycard"
                                                        width={'135px'}
                                                        height={'55px'}
                                                    />
                                                    <Shimmer
                                                        className="shimmer paycard"
                                                        width={'135px'}
                                                        height={'55px'}
                                                    />
                                                    <Shimmer
                                                        className="shimmer paycard"
                                                        width={'135px'}
                                                        height={'55px'}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h4>Choose payment method</h4>

                                                <Swiper
                                                    breakpoints={{
                                                        320: {
                                                            slidesPerView: 2
                                                        },
                                                        568: {
                                                            slidesPerView: 3
                                                        },
                                                        768: {
                                                            slidesPerView: 4
                                                        }
                                                    }}
                                                    modules={[Navigation, Autoplay]}
                                                    className="payments"
                                                    spaceBetween={20}
                                                    slidesPerView={4}
                                                    navigation={true}
                                                    autoplay={false}
                                                >
                                                    <SwiperSlide>
                                                        <PaymentMethod
                                                            icon={appleIcon}
                                                            name={'Apple pay'}
                                                            className={
                                                                selectedPaymentMethod === 'apple'
                                                                    ? 'pay-active'
                                                                    : ''
                                                            }
                                                            onClick={() =>
                                                                setSelectedPaymentMethod('apple')
                                                            }
                                                        />
                                                    </SwiperSlide>
                                                    <SwiperSlide>
                                                        <PaymentMethod
                                                            icon={googleIcon}
                                                            name={'Google pay'}
                                                            className={
                                                                selectedPaymentMethod === 'google'
                                                                    ? 'pay-active'
                                                                    : ''
                                                            }
                                                            onClick={() =>
                                                                setSelectedPaymentMethod('google')
                                                            }
                                                        />
                                                    </SwiperSlide>

                                                    <SwiperSlide>
                                                        <PaymentMethod
                                                            icon={cardIcon}
                                                            name={'Card'}
                                                            className={
                                                                selectedPaymentMethod === 'card'
                                                                    ? 'pay-active'
                                                                    : ''
                                                            }
                                                            onClick={() =>
                                                                setSelectedPaymentMethod('card')
                                                            }
                                                            // onClick={() => setCard(!card)}
                                                        />
                                                    </SwiperSlide>
                                                    <SwiperSlide>
                                                        <PaymentMethod
                                                            icon={paypalIcon}
                                                            className={
                                                                selectedPaymentMethod === 'paypal'
                                                                    ? 'pay-active'
                                                                    : ''
                                                            }
                                                            onClick={() =>
                                                                setSelectedPaymentMethod('paypal')
                                                            }
                                                        />
                                                    </SwiperSlide>
                                                </Swiper>
                                            </>
                                        )}
                                    </div>
                                    {/* {selectedPaymentMethod === 'google' && (
                                        <GooglePay
                                            setIsPaymentSuccess={setIsPaymentSuccess}
                                            data={invoiceData}
                                        />
                                    )} */}

                                    {/* {selectedPaymentMethod === 'card' && (
                                        <CardPay
                                            setIsPaymentSuccess={setIsPaymentSuccess}
                                            data={invoiceData}
                                        />
                                    )} */}
                                    {card && (
                                        <div className="card-form-area">
                                            <form action="">
                                                <div className="card-field">
                                                    <label htmlFor="">Card number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="1234  1234  1234  1234"
                                                    />
                                                </div>
                                                <div className="expiration-cvc">
                                                    <div className="card-field">
                                                        <label htmlFor="">Expiration</label>
                                                        <input type="text" placeholder="MM/YY" />
                                                    </div>
                                                    <div className="card-field">
                                                        <label htmlFor="">CVC</label>
                                                        <input type="text" placeholder="234" />
                                                    </div>
                                                </div>
                                                <div className="card-field">
                                                    <label htmlFor="">Cardholder name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Cardholder name"
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    }

                    {isInvoiceError && !invoiceData && <p>{msg}</p>}
                </div>
            )}
        </div>
    );
};

export default InvoicePayment;
