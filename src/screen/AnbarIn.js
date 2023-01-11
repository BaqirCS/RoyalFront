import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../component/Loader';
import MessageBox from '../component/MessageBox';
import { anbarInReducer, initialState } from '../reducers/AnbarinReducer';
import { Store } from '../context/Store';

function AnbarIn() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(anbarInReducer, initialState);
  const { state: ctxState } = useContext(Store);

  useEffect(() => {
    getAllIncomes();
  }, []);
  const getAllIncomes = async () => {
    try {
      dispatch({ type: 'GET_R_REQUEST' });
      const { data } = await axios.get(
        `${ctxState.baseUrl}/transaction/input`,
        {
          headers: {
            authorization: `Bearer ${ctxState.userCredentials.token}`,
          },
        }
      );
      dispatch({ type: 'GET_R_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'GET_R_FAIL', payload: error.response.data });
    }
  };
  const clickHandler = (date) => {
    navigate(`/singleinput/${date}`);
  };
  const showMessage = () => {
    // dispatch({ type: 'RESET' });
  };
  return (
    <div className="container mt-4" style={{ marginBottom: '80px' }}>
      {state.loading ? (
        <Loader />
      ) : (
        <div>
          {state.error ? (
            <MessageBox
              color="danger"
              message={state.message}
              showMessage={showMessage}
            />
          ) : (
            <>
              {' '}
              <h2 className="text-center mb-4 mt-3">
                تمامی ورودی ها به انبار{' '}
              </h2>
              <table
                className="table align-middle mb-0 table-hover mbxb"
                style={{ backgroundColor: '#eee' }}
              >
                <thead className="coloritable text-white ">
                  <tr className="text-center">
                    <th>سال</th>

                    <th>ماه </th>
                    <th> تعداد ورودی</th>
                    <th> جزییات </th>
                  </tr>
                </thead>
                <tbody>
                  {state.products &&
                    state.products.map((item, index) => (
                      <tr className="text-center" key={index}>
                        <td>{item.month}</td>
                        <td>{item.year}</td>
                        <td>{item.number} </td>
                        <td>
                          {' '}
                          <button
                            className="btn btn"
                            onClick={(e) =>
                              clickHandler(`${item.year}-${item.month}`)
                            }
                          >
                            <i
                              className="bi bi-box-arrow-right"
                              style={{ color: 'green' }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AnbarIn;
