import { useCallback, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Form,
  Table,
  Modal,
  Stack,
} from "react-bootstrap";
import { Check2Circle, XCircle } from "react-bootstrap-icons";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";

async function updateAccount(headersArg, body) {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8080/update", {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      ...headersArg,
    },
    body: JSON.stringify(body),
  });
  return response;
}

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  async function handleSignoutButton() {
    setLoading(true);
    await signoutUser();
    setLoading(false);
  }
  function signoutUser() {
    const token = localStorage.getItem("token");
    return fetch("http://localhost:8080/signout", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + token,
      },
    })
      .then(() => {
        localStorage.removeItem("token");
        navigateTo("/signin");
      })
      .catch((e) => console.error(e));
  }

  async function deleteUsers(userIds) {
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/delete", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ userIds }),
    });

    if (!response.ok) {
      localStorage.removeItem("token");
      navigateTo("/signin");
    } else {
      const users = await response.json();
      setUsers(users);
      setLoading(false);
      setShowModal(false);
    }
  }

  async function setAccountStatus(userIds, isBlocked) {
    setLoading(true);
    const response = await updateAccount(
      {},
      {
        userIds,
        isBlocked,
      }
    );

    if (!response.ok) {
      localStorage.removeItem("token");
      console.log("setAccountStatus - 401");
      navigateTo("/signin");
    } else {
      const users = await response.json();
      setUsers(users);
      handleSelectAllUserIds(false);
    }

    setLoading(false);
  }

  function handleUserCheckbox(isChecked, userId) {
    isChecked ? selectUser(userId) : unSelectUser(userId);
  }

  function selectUser(userId) {
    const updatedSelectedUserIds = [...selectedUserIds, userId];
    setSelectedUserIds(updatedSelectedUserIds);
  }

  function unSelectUser(userId) {
    const filteredUserIds = selectedUserIds.filter(
      (currUserId) => currUserId !== userId
    );
    setSelectedUserIds(filteredUserIds);
  }

  function handleSelectAllUserIds(isChecked) {
    const allUserIds = isChecked ? users.map((user) => user._id) : [];
    setSelectedUserIds(allUserIds);
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/users", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) {
      localStorage.removeItem("token");
      console.log("fetchUser - 401");
      navigateTo("/signin");
    }
    const data = await response.json();
    setUsers(data);
    setLoading(false);
  }, [navigateTo]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return (
    <div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className='text-danger fs-5'>Deleting users</Modal.Title>
        </Modal.Header>
        <Modal.Body className='fs-5'>Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant='danger'
            disabled={loading}
            onClick={() => deleteUsers(selectedUserIds)}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Stack direction='horizontal'>
        <ButtonToolbar>
          <ButtonGroup className='me-2'>
            <Button
              size=''
              variant='danger'
              disabled={!selectedUserIds.length || loading}
              onClick={() => setAccountStatus(selectedUserIds, true)}
            >
              Block
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button
              variant='light'
              title={`Unblock ${selectedUserIds.length > 1 ? "users" : "user"}`}
              disabled={!selectedUserIds.length || loading}
              onClick={() => setAccountStatus(selectedUserIds, false)}
            >
              <Check2Circle color='green' />
            </Button>
            <Button
              variant='light'
              title={`Delete ${selectedUserIds.length > 1 ? "users" : "user"}`}
              disabled={!selectedUserIds.length || loading}
              onClick={() => setShowModal(true)}
            >
              <XCircle color='tomato' />
            </Button>
          </ButtonGroup>
        </ButtonToolbar>

        <Button
          variant='light'
          className='ms-auto'
          disabled={loading}
          onClick={handleSignoutButton}
        >
          {loading ? "Processing..." : "Sign out"}
        </Button>
      </Stack>

      <Table striped bordered className='mt-2'>
        <thead>
          <tr className='align-middle'>
            <th>
              <Form.Check
                type='checkbox'
                onChange={(e) => handleSelectAllUserIds(e.target.checked)}
              />
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
          {users.length
            ? users.map((user) => (
                <tr key={user._id} className='align-middle'>
                  <td>
                    <Form.Check
                      checked={selectedUserIds.includes(user._id)}
                      type='checkbox'
                      onChange={(e) =>
                        handleUserCheckbox(e.target.checked, user._id)
                      }
                    />
                  </td>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.lastSignedAt)}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td
                    className={user.isBlocked ? "text-warning" : "text-success"}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </Table>
      {loading ? "Loading..." : null}
    </div>
  );
}

export default Dashboard;
