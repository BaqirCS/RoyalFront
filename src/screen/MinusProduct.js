import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../component/Loader';
import MessageBox from '../component/MessageBox';
import { Store } from '../context/Store';
import {
  decreaseFromAnbarReducer,
  initialState,
} from '../reducers/decreseFromAnbarReducer';
import Calender from './Calender';

function MinusProduct() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(decreaseFromAnbarReducer, initialState);
  const [item, setItem] = useState({
    _id: '',
    name: '',
    type: '',
    amount: '',
    category: '',
  });
  const [product, setProduct] = useState({
    name: '',
    type: '',
    amount: '',
    date: '',
    outer: '',
    reason: '',
    productId: '',
  });
  const [time, setTime] = useState({ fa: '' });
  const { state: ctxState } = useContext(Store);

  useEffect(() => {
    getSingleProduct();
    // eslint-disable-next-line
  }, []);
  const getSingleProduct = async () => {
    try {
      dispatch({ type: 'GET_P_REQUEST' });
      const { data } = await axios.get(`${ctxState.baseUrl}/anbar/${id}`, {
        headers: {
          authorization: `Bearer ${ctxState.userCredentials.token}`,
        },
      });
      setItem(data);
      dispatch({ type: 'GET_P_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'GET_P_FAIL', payload: error.response.data });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    product.name = item.name;
    product.type = item.type;
    product.productId = item._id;
    product.date = time.fa;
    if (!product.date) {
      return dispatch({
        type: 'SEND_R_FAIL',
        payload: 'تاریخ خروج الزامی است',
      });
    }
    if (!product.amount || product.amount <= 0) {
      return dispatch({
        type: 'SEND_R_FAIL',
        payload: 'مقدار خروج الزامی است',
      });
    }
    if (!product.outer) {
      return dispatch({
        type: 'SEND_R_FAIL',
        payload: 'نام شخص خارج  کننده الزامی است',
      });
    }
    if (!product.reason) {
      return dispatch({
        type: 'SEND_R_FAIL',
        payload: '    دلیل خارج کردن الزامی است',
      });
    }
    try {
      dispatch({ type: 'SEND_R_REQUEST' });
      await axios.post(`${ctxState.baseUrl}/transaction/out`, product, {
        headers: {
          authorization: `Bearer ${ctxState.userCredentials.token}`,
        },
      });
      dispatch({ type: 'SEND_R_SUCCESS' });
      setProduct({
        name: '',
        type: '',
        amount: '',
        date: '',
        outer: '',
        reason: '',
        productId: '',
      });
    } catch (error) {
      dispatch({ type: 'SEND_R_FAIL', payload: error.response.data });
    }
  };
  const showMessage = () => {
    dispatch({ type: 'RESET' });
  };
  const showMessage1 = () => {
    dispatch({ type: 'RESET' });
  };
  const backHandler = () => {
    window.history.back();
  };
  const showClickHandler = () => {
    setTime({ fa: '' });
  };
  return (
    <div className="container mb-2 mt-4 ">
      {state.loading ? (
        <Loader />
      ) : state.error ? (
        <MessageBox
          showMessage={showMessage1}
          color="danger"
          message={state.message}
        />
      ) : (
        <>
          {' '}
          <div className="xp">
            <button
              onClick={backHandler}
              className="btn btn-primary colorButtoms butonx"
              style={{
                color: 'white',
              }}
            >
              <i className="bi bi-arrow-left"> </i>
              برگشت
            </button>
          </div>
          <h2 className="text-center mb-3 marginManfi">
            خارج کردن جنس از انبار{' '}
          </h2>
          {state.success && (
            <MessageBox
              showMessage={showMessage}
              color="info"
              message={state.message}
            />
          )}
          {state.sendError && (
            <MessageBox
              showMessage={showMessage}
              color="danger"
              message={state.message}
            />
          )}
          <form className="inp ">
            {' '}
            <div className="row  mb-3 ">
              <div className="form-group col-md-3 rtl1 mrotwo mb-2">
                <label htmlFor="name" className="mb-2">
                  نام جنس
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="نام جنس"
                  value={item.name && item.name}
                  disabled
                />
              </div>
              <div className="col-md-2 "></div>

              <div className="form-group rtl1 col-md-3 mb-2 ">
                <label htmlFor="type" className="mb-2">
                  واحد
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="type"
                  placeholder="واحد اندازه گیری"
                  value={item.type && item.type}
                  disabled
                />
              </div>
            </div>
            <div className="row  mb-3">
              <div className="form-group col-md-3 rtl1 mrotwo mb-2">
                <label htmlFor="current" className="mb-2">
                  مقدار انبار
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="current"
                  placeholder="مقدار در انبار"
                  value={item.amount && item.amount}
                  disabled
                />
              </div>
              <div className="col-md-2"></div>

              <div className="form-group col-md-3 rtl1 mb-2 ">
                <label htmlFor="newAmount" className="mb-2">
                  مقدار جنس خارج شده{' '}
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="newAmount"
                  placeholder="مقدار جنس خارج شده"
                  value={product.amount}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="row  mb-3">
              <div className="form-group col-md-3 rtl1 mrotwo mb-2">
                <label htmlFor="reciever" className="mb-2">
                  خارج کننده
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="شخص خارج کننده"
                  id="reciever"
                  value={product.outer}
                  onChange={(e) =>
                    setProduct({ ...product, outer: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2 "></div>
              <div className="form-group col-md-3  rtl1 mb-2">
                <label htmlFor="date" className="mb-2">
                  تاریخ
                </label>
                <div>
                  {!time.fa ? (
                    <>
                      <Calender setTime={setTime} />
                    </>
                  ) : (
                    <>
                      <button onClick={showClickHandler}>
                        {' '}
                        <i className="bi bi-calendar"></i>
                      </button>
                      <b className="mx-3"> {time.fa}</b>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="row  mb-3">
              <div className="form-group col-md-8 rtl1 mrotwo mb-2">
                <div className="">
                  <label htmlFor="formReason" className="mb-2">
                    دلیل
                  </label>
                  <textarea
                    className="form-control"
                    id="formReason"
                    rows={2}
                    value={product.reason}
                    onChange={(e) =>
                      setProduct({ ...product, reason: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div
              className="row  mb-3
           text-center align-items-center justify-content-center"
            >
              <button
                type="submit"
                onClick={submitHandler}
                className="btn btn-primary colorButtoms"
                style={{
                  width: '225px',
                  color: 'white',
                  marginBottom: '100px',
                }}
              >
                خارج کردن از انبار
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default MinusProduct;
