import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import orderService from "../services/orderService";
import { toast } from "react-toastify";
import OrderItem from "./orderItem";
import productService from "../services/productService";
import { Link } from "react-router-dom";
class CreateOrder extends Form {
  state = {
    data: {
      custName: "",
      orderItems: [
        {
          id: 0,
          description: "",
          quantity: 1,
        },
      ],
      important: false,
      totalPrice: 0,
    },

    errors: {
      custName: "",
      orderItems: [],
    },
    dbdata: [],
  };
  counter = 1;

  orderItemsSchema = {};

  schema = {};

  //Fetch data from db and setState
  componentDidMount = async () => {
    const { data: dbdata } = await productService.getAllProducts();
    if (dbdata) {
      this.setState({
        dbdata,
      });
    }
  };

  //Update Joi schema after data has been fetched
  componentDidUpdate = () => {
    this.orderItemsSchema = {
      id: Joi.number(),
      description: Joi.string()
        .valid(this.state.dbdata.map((item) => item.description))
        //Will be valid only if matches an item.description
        .label("Description"),
      quantity: Joi.number().min(1).label("Quantity"),
    };
    this.schema = {
      custName: Joi.string().min(2).max(30).required().label("Customer Name"),
      orderItems: Joi.array()
        .label("orderItems")
        .required()
        .items(this.orderItemsSchema),
      important: Joi.boolean().required(),
      totalPrice: Joi.number().required(),
    };
  };

  /* "handleErrChange" will invoke inside the "handleChange" function in 'form.jsx' */
  // "handleErrChange" rearranges the 'error' object of the state, due to changes.
  handleErrChnge = (errors, input, errorMessage) => {
    if (errorMessage) {
      if (input.name === "custName") {
        errors[input.name] = errorMessage;
      } else {
        errors.orderItems = errors.orderItems.filter(
          (item) => !item.hasOwnProperty(`${input.name}<${input.id}>`)
        );
        errors.orderItems.push({
          [`${input.name}<${input.id}>`]: errorMessage,
        });
      }
    } else {
      errors.hasOwnProperty(input.name)
        ? delete errors[input.name]
        : (errors.orderItems = errors.orderItems.filter(
            (item) => !item.hasOwnProperty(`${input.name}<${input.id}>`)
          ));
    }
  };

  /* "handleErrRndr" will invoke inside the "renderInput" function in 'form.jsx' */
  // "handleErrRndr" returns the relevant error message in order to match its relevant input.
  handleErrRndr = (errors, name, id) => {
    if (name !== "custName") {
      let i = errors.orderItems?.find((item) =>
        item.hasOwnProperty(`${name}<${id}>`)
      );
      return i ? i[`${name}<${id}>`] : null;
    } else {
      return errors[name];
    }
  };

  doSubmit = async () => {
    const data = { ...this.state.data };
    await orderService.createOrder(data);
    this.setState({ data });
    this.props.history.replace("/orders");
    toast("The Order Has Been Listed Successfuly", {
      className: "successToast",
    });
  };

  duplicateItem = (e) => {
    e.preventDefault();
    let data = { ...this.state.data };
    let orderItems = [...this.state.data.orderItems];
    let item = {
      id: this.counter,
      description: "",
      quantity: 1,
    };
    this.setState({ data: { ...data, orderItems: [...orderItems, item] } });
    this.counter++;
  };

  deleteItem = (e, id) => {
    e.preventDefault();
    let data = { ...this.state.data };
    let orderItems = [...this.state.data.orderItems];
    //Rearrange "orderItems" to be without the deleted item;
    orderItems = orderItems.filter((item) => item.id !== id);
    this.counter = 0;
    //Reset the counter (id) to each item;
    orderItems.map((item) => (item.id = this.counter++));
    this.setState({ data: { ...data, orderItems } });
  };

  totalPrice = () => {
    const { data, dbdata } = this.state;
    const prices = data.orderItems.map(
      (item) =>
        dbdata.find((dbItem) => dbItem.description === item.description)
          ?.price * item.quantity || 0
    );
    const totalPrice = Number(
      prices
        .reduce((a, b) => {
          return a + b;
        }, 0)
        .toFixed(2)
    );
    this.setState({ data: { ...data, totalPrice } });
    return totalPrice;
  };

  renderTable = () => {
    const { data, dbdata } = this.state;
    return (
      <table className='table table-sm col-12 col-md-8 mx-auto table-bordered table-warning table-striped border-2'>
        <caption className='d-none'>Selected Products</caption>
        <thead className='text-dark bg-warning'>
          <tr>
            <th scope='col'>No.</th>
            <th scope='col'>Description</th>
            <th scope='col'>Quantity</th>
            <th scope='col'>Price</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody className='text-dark'>
          {data.orderItems.map((item) => (
            <OrderItem
              deleteBtn={item.id}
              key={item.id}
              thisParent={this}
              price={Number(
                (
                  dbdata.find(
                    (dbItem) => dbItem.description === item.description
                  )?.price * item.quantity
                ).toFixed(2)
              )}
            />
          ))}
        </tbody>
      </table>
    );
  };

  render() {
    const { data } = this.state;
    return (
      <div className='container-fluid mt-2'>
        <div className='row'>
          <div className='col-10 text-center heading mx-auto my-5'>
            <h1 className='display-3'>New Order</h1>
          </div>
        </div>
        <form noValidate autoComplete='off' onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='col-12 col-lg-8 mx-auto'>
              {this.renderInput("custName", "Customer Name")}
            </div>
          </div>
          <div className='row-fluid'>
            {data.custName.length ||
            data.orderItems.find((item) => item.description) ? (
              this.renderTable()
            ) : (
              <p className='text-center'>
                <strong>Please provide customer name to continue...</strong>
              </p>
            )}
          </div>
          <div className='row mt-3'>
            <span className='col-12 text-center mt-1 mb-5 h4'>{`Total Order Price: $${data.totalPrice}`}</span>
            <div className='col-10 col-md-8 col-lg-4 mx-auto text-center'>
              <Link to='/orders' className='btn btn-secondary mx-3'>
                Cancel
              </Link>
              <span className='mx-3'>{this.renderButton("Submit")}</span>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateOrder;
