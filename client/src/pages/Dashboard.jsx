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
import { updateAccount } from "../utils/updateAccount";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const navigateTo = useNavigate();

  function handleUnAuthedRequest() {
    localStorage.removeItem("token");
    navigateTo("/signin");
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (response.ok) {
      const users = await response.json();
      setUsers(users);
      setLoading(false);
    } else {
      handleUnAuthedRequest();
    }
  }, []);

  async function handleSignoutButton() {
    setIsSigningOut(true);
    await signoutUser();
    handleUnAuthedRequest();
    setIsSigningOut(false);
  }

  async function signoutUser() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/signout`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + token,
      },
    });
    return response;
  }

  async function handleDeleteButton() {
    setIsDeleting(true);
    const response = await deleteUsers(selectedUserIds);
    if (!response.ok) {
      handleUnAuthedRequest();
    } else {
      const users = await response.json();
      setUsers(users);
      setIsDeleting(false);
      setShowModal(false);
    }
  }

  async function deleteUsers(userIds) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/delete`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ userIds }),
    });
    return response;
  }

  async function setAccountStatus(userIds, isBlocked) {
    setLoading(true);
    const headers = {};
    const body = { userIds, isBlocked };
    const response = await updateAccount(headers, body);

    if (!response.ok) {
      handleUnAuthedRequest();
    } else {
      const users = await response.json();
      setUsers(users);
      handleSelectAllUserIds(false);
    }

    setLoading(false);
  }

  function handleUserSelect(isChecked, userId) {
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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return (
    <div>
      <Stack direction='horizontal'>
        <ButtonToolbar>
          <ButtonGroup className='me-2'>
            <Button
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
              disabled={!selectedUserIds.length || isDeleting}
              onClick={() => setShowModal(true)}
            >
              <XCircle color='tomato' />
            </Button>
          </ButtonGroup>
        </ButtonToolbar>

        <Button
          variant='light'
          className='ms-auto'
          disabled={isSigningOut}
          onClick={handleSignoutButton}
        >
          {isSigningOut ? "Processing..." : "Sign out"}
        </Button>
      </Stack>

      <Table striped bordered className='mt-2'>
        <thead>
          <tr className='align-middle'>
            <th>
              <Form.Check
                type='checkbox'
                checked={users.length && selectedUserIds.length === users.length}
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
                        handleUserSelect(e.target.checked, user._id)
                      }
                    />
                  </td>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.lastSignedAt)}</td>
                  <td>{formatDate(user.createdAt, false)}</td>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className='text-danger fs-5'>Deleting users</Modal.Title>
        </Modal.Header>
        <Modal.Body className='fs-6'>Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant='danger'
            disabled={isDeleting}
            onClick={handleDeleteButton}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
      {loading ? "Loading..." : null}
    </div>
  );
}

export default Dashboard;
