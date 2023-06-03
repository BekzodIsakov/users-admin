import { Form, Table } from "react-bootstrap";
// import Form from "react-bootstrap/Form";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function App() {
  const today = new Date();
  return (
    <>
    
      <Table striped bordered>
        <thead>
          <tr>
            <th>
              <Form.Check type='checkbox' />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last login</th>
            <th>Registration date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className='align-middle'>
            <td>
              <Form.Check type='checkbox' />
            </td>
            <td>14ngl03nefnwro</td>
            <td>John Doe</td>
            <td>john_doe@email.com</td>
            <td>
              {monthNames[today.getMonth() + 1]} {today.getDate()},{" "}
              {today.getFullYear()}
            </td>
            <td>
              {monthNames[today.getMonth() + 1]} {today.getDate()},{" "}
              {today.getFullYear()}
            </td>
            <td className='text-success'>Active</td>
          </tr>

          <tr className='align-middle'>
            <td>
              <Form.Check type='checkbox' />
            </td>
            <td>97adl42grwnrww</td>
            <td>John Smith</td>
            <td>john_smith@email.com</td>
            <td>
              {monthNames[today.getMonth() + 1]} {today.getDate()},{" "}
              {today.getFullYear()}
            </td>
            <td>
              {monthNames[today.getMonth() + 1]} {today.getDate()},{" "}
              {today.getFullYear()}
            </td>
            <td className='text-danger'>Blocked</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default App;
