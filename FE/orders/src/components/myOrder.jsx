import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import orderService from "../services/orderService";
// import axios from "axios";

class MyOrder extends Component {
  state = {
    data: {
      _id: "",
      custName: "",
      orderItems: [
        {
          _id: "",
          desription: "",
          quantity: 0,
        },
      ],
      createdAt: "",
    },
  };
  counter = 1;

  componentDidMount = async () => {
    const data = await orderService
      .getOrder(this.props.match.params.id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        this.props.history.replace("/notFound");
        console.error(error.response);
      });

    if (data) {
      this.setState({ data: data[0] });
    }
  };

  dltOrder = async () => {
    let data = { ...this.state.data };
    if (window.confirm("ARE YOU SURE?")) {
      await orderService.deleteOrder(data._id);
      data = null; //?
      await this.props.history.replace("/orders");
      toast(`Order ${this.state.data._id} has been successfuly deleted`);
    } else return null;
  };

  render() {
    const { data } = this.state;
    console.log(this.state.data);
    return (
      <div className='container mt-5'>
        <div className='row'>
          <div className='card link-warning shadow col-12 col-md-11 mx-auto'>
            <h5 className='card-header'>{`${data._id}`}</h5>
            <div className='card-body col-12'>
              <ul className='list-group list-group-flush mx-auto'>
                <li className='list-group-item text-info h5'>
                  Client: <span className='h5 text-dark'>{data.custName}</span>
                </li>
                <li className='list-group-item text-info'>
                  <h5>Products Ordered: </h5>
                  <div className='row'>
                    {data.orderItems.map((item) => {
                      return (
                        <div
                          className='card col-12 col-md-6 col-lg-4 mt-3 bg-light text-dark'
                          key={this.counter++}>
                          <p className='card-header'>{`SN: ${item._id}`}</p>
                          <div className='card-body'>
                            {" "}
                            <ul className='list-group w-100 list-group-flush'>
                              <li className='list-group-item'>
                                Description:{" "}
                                <span className='text-secondary'>
                                  {item.description}
                                </span>
                              </li>
                              <li className='list-group-item'>
                                SN:{" "}
                                <span className='text-secondary'>
                                  {item._id}
                                </span>
                              </li>
                              <li className='list-group-item'>
                                Quantity:{" "}
                                <span className='text-secondary'>
                                  {item.quantity}
                                </span>
                              </li>
                              <li className='list-group-item'>
                                Unit Price:{" "}
                                <span className='text-secondary'>
                                  {`$${Number(
                                    (Math.random() * 151).toFixed(2)
                                  )}`}
                                </span>
                              </li>
                              <li className='list-group-item'>
                                Total:{" "}
                                <span className='text-secondary'>
                                  {`$${Number(
                                    (Math.random() * 302).toFixed(2)
                                  )}`}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </li>
                <li className='list-group-item col-12 text-center text-info h4'>
                  Total Price:{" "}
                  <span className='h3 text-dark'>{`$${Number(
                    (Math.random() * 302 * data.orderItems.length).toFixed(2)
                  )}`}</span>
                </li>
                {}
              </ul>
            </div>
            <div className='container'>
              <div className='row'>
                <Link
                  to={`/edit-order/${data._id}`}
                  className='col-6 text-primary text-left'>
                  <i className='fas fa-edit mr-1'></i> Edit
                </Link>
                <div
                  className='col-6 delete text-danger text-right'
                  onClick={this.dltOrder}>
                  <i className='fas fa-trash mr-1'></i> Delete
                </div>
              </div>
              <div className='col-12 text-center bg-light text-secondary mt-2 mx-auto'>
                Created At {data.createdAt}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyOrder;
