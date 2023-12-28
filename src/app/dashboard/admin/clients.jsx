'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClients, getClientsBySearch } from '@/redux/features/clientsList';
import {
  makeClient,
  updateClient,
  getClientById,
  deleteClientByID,
} from '@/redux/features/clients';
import { SearchIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectItem,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  NumberInput,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextInput,
  Title,
} from '@tremor/react';
import { Icon } from '@iconify/react';

export default function Clients(props) {
  const router = useRouter();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const clientsList = useSelector((state) => state.clientRoot.clientsList);
  const client = useSelector((state) => state.clientRoot.clients);

  const [refresh, setRefresh] = useState(false);
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');
  const [newClient, setNewClient] = useState(false);
  const [editClient, setEditClient] = useState(false);
  const [editId, setEditId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [deleteClient, setDeleteClient] = useState(false);
  const [newClientData, setNewClientData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    status: '',
    password: '',
    age: '',
    dob: '',
    initial_weight: '',
    height: '',
    role: '0ce3fcd3-92a1-453d-8067-8308d5c372ad',
  });
  const [editClientData, setEditClientData] = useState({});
  const [schedule, setSchedule] = useState(false);
  const [scheduleId, setScheduleId] = useState('');
  const [newClientErrors, setNewClientErrors] = useState(false);

  const handelEdit = async (id) => {
    setEditId(id);
    document.body.classList.add('overflow-hidden');
    await dispatch(
      getClientById({
        id: id,
        token: user.token,
      })
    );

    setEditClient(true);
  };

  const handelDeleteClient = async () => {
    await dispatch(
      deleteClientByID({
        id: deleteId,
        token: user.token,
      })
    );

    dispatch(
      getClients({
        page: props.page,
        token: user.token,
      })
    );
  };

  const handelEditClient = async () => {
    await dispatch(
      updateClient({
        id: editId,
        data: editClientData,
        token: user.token,
      })
    );

    dispatch(
      getClients({
        page: props.page,
        token: user.token,
      })
    );
  };

  const handleNewClient = async () => {
    if (
      newClientData.first_name === '' ||
      newClientData.email === '' ||
      newClientData.password === ''
    ) {
      setNewClientErrors(true);
    } else {
      setNewClientErrors(false);
    }

    console.log(newClientErrors);

    if (!newClientErrors) {
      await dispatch(
        makeClient({
          data: newClientData,
          token: user.token,
        })
      );
      dispatch(
        getClients({
          page: props.page,
          token: user.token,
        })
      );
      setNewClient(false);
      document.body.classList.remove('overflow-hidden');
    }
  };

  const handleSearch = async () => {
    if (search === '') {
      dispatch(
        getClients({
          page: props.page,
          token: user.token,
        })
      );
    } else {
      dispatch(
        getClientsBySearch({
          page: props.page,
          token: user.token,
          search: search,
        })
      );
    }
  };

  useEffect(() => {
    dispatch(
      getClients({
        page: props.page,
        token: user.token,
      })
    );
    setRefresh(false);
  }, [props.page, dispatch, refresh]);

  return (
    <>
      {newClient && (
        <div className=' absolute right-0 top-0 z-10 h-screen w-4/5 min-w-[300px]  rounded-sm bg-tremor-brand-faint p-2 dark:bg-dark-tremor-background-subtle'>
          <div className='flex items-center justify-between gap-2 '>
            <Title>New Client</Title>
            <Button
              onClick={() => {
                setNewClient(false),
                  setNewClientErrors(false),
                  document.body.classList.remove('overflow-hidden');
              }}
              size='xs'
              variant='primary'
            >
              close
            </Button>
          </div>
          <div className='mt-2 flex flex-col gap-1.5'>
            <div className=' flex gap-1'>
              <TextInput
                error={
                  newClientData.first_name === '' && newClientErrors
                    ? true
                    : false
                }
                onChange={(e) => {
                  setNewClientData({
                    ...newClientData,
                    first_name: e.target.value,
                  });
                }}
                placeholder='First Name *'
              />
              <TextInput
                onChange={(e) => {
                  setNewClientData({
                    ...newClientData,
                    last_name: e.target.value,
                  });
                }}
                placeholder='Last Name'
              />
            </div>

            <TextInput
              onChange={(e) => {
                setNewClientData({
                  ...newClientData,
                  email: e.target.value,
                });
              }}
              error={
                newClientData.email === '' && newClientErrors ? true : false
              }
              placeholder='Email *'
            />
            <NumberInput
              onChange={(e) => {
                setNewClientData({
                  ...newClientData,
                  age: e.target.value,
                });
              }}
              placeholder='Age'
            />
            <div className=' flex flex-col gap-0.5'>
              <span className=' px-2 text-[10px]'>Date of birth</span>
              <input
                className='  h-10 rounded-md border border-tremor-border bg-tremor-background px-2 text-tremor-content  outline-none hover:bg-tremor-background-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-background-muted'
                type='date'
                onChange={(e) => {
                  setNewClientData({
                    ...newClientData,
                    dob: e.target.value,
                  });
                }}
                label='Date of Birth'
                placeholder='DoB'
              ></input>
            </div>

            <Select placeholder='Active'>
              <SelectItem
                onClick={() => {
                  setNewClientData({
                    ...newClientData,
                    status: 'active',
                  });
                }}
                value='active'
              >
                Active
              </SelectItem>
              <SelectItem
                onClick={() => {
                  setNewClientData({
                    ...newClientData,
                    status: 'suspended',
                  });
                }}
                value='suspended'
              >
                suspended
              </SelectItem>
            </Select>
            <TextInput
              onChange={(e) => {
                setNewClientData({
                  ...newClientData,
                  password: e.target.value,
                });
              }}
              error={
                newClientData.password === '' && newClientErrors ? true : false
              }
              placeholder='Password *'
            />
            <NumberInput
              onChange={(e) => {
                setNewClientData({
                  ...newClientData,
                  initial_weight: e.target.value,
                });
              }}
              placeholder='Initial weight in kg'
            />
            <NumberInput
              onChange={(e) => {
                setNewClientData({
                  ...newClientData,
                  height: e.target.value,
                });
              }}
              placeholder='Height in cm'
            />
            {newClientErrors && (
              <div className=' text-red-500'>
                Please fill in all the required fields
              </div>
            )}
            <Button
              onClick={() => {
                handleNewClient();
              }}
              className='mt-2'
              size='xs'
              variant='primary'
            >
              Create
            </Button>
          </div>
        </div>
      )}
      <div className=' px-3'>
        <div className='flex'>
          <div className='flex gap-2 '>
            <Button
              className=' text-base'
              size='xs'
              variant='secondary'
              onClick={() => setRefresh(true)}
            >
              <Icon icon='material-symbols:refresh' />
            </Button>
            <Title>Clients</Title>
          </div>
        </div>
        <Card className='mt-4'>
          <div className='flex flex-col flex-wrap gap-2  md:flex-row md:items-center md:justify-between'>
            <div className=' flex w-full  gap-1 md:w-2/3'>
              <TextInput
                icon={SearchIcon}
                onChange={(e) => {
                  setSearch(e.target.value);
                  props.setPage(1);
                }}
                placeholder='Search...'
              />
              <Button onClick={handleSearch} size='xs' variant='primary'>
                Search
              </Button>
            </div>

            <Button
              onClick={() => {
                setNewClient(true),
                  setNewClientData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    age: '',
                    initial_weight: '',
                    height: '',
                    role: '0ce3fcd3-92a1-453d-8067-8308d5c372ad',
                  }),
                  document.body.classList.add('overflow-hidden');
              }}
              size='xs'
              variant='primary'
            >
              New User
            </Button>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Active</TableHeaderCell>
                <TableHeaderCell>Edit</TableHeaderCell>
                <TableHeaderCell>Delete</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientsList?.clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    {client.first_name} {client.last_name}
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.status}</TableCell>
                  <TableCell
                    className=' cursor-pointer'
                    onClick={() => {
                      handelEdit(client.id);
                    }}
                  >
                    Edit
                  </TableCell>
                  <TableCell
                    className=' cursor-pointer'
                    onClick={() => {
                      setDeleteClient(true);
                      setDeleteId(client.id);
                    }}
                  >
                    Delete
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className=' mt-3 flex justify-center gap-4'>
            <Button
              onClick={() => {
                if (props.page > 1) {
                  props.setPage(props.page - 1);
                }
              }}
              size='xs'
              variant='secondary'
            >
              Previous
            </Button>
            <div className='text-lg text-tremor-brand-emphasis  dark:text-dark-tremor-brand-emphasis'>
              Page - {props.page}
            </div>
            <Button
              onClick={() => {
                if (clientsList?.clients.length >= 10) {
                  props.setPage(props.page + 1);
                }
              }}
              size='xs'
              variant='secondary'
            >
              Next
            </Button>
          </div>
        </Card>
      </div>

      {deleteClient && (
        <div className='absolute top-0 grid h-full w-full  items-center backdrop-blur-xl'>
          <Card className='  w-46  m-auto '>
            Do you want to delete this client?
            <div className='mt-2 flex gap-2'>
              <Button
                onClick={() => {
                  handelDeleteClient();
                  setDeleteClient(false);
                }}
                size='xs'
                variant='primary'
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  setDeleteClient(false);
                }}
                size='xs'
                variant='secondary'
              >
                No
              </Button>
            </div>
          </Card>
        </div>
      )}

      {editClient && (
        <div className=' absolute right-0 top-0 z-10 h-screen w-4/5 min-w-[300px]  rounded-sm bg-tremor-brand-faint p-2 dark:bg-dark-tremor-background-subtle'>
          <div className='flex items-center justify-between gap-2 '>
            <Title>Edit Client</Title>

            <Button
              onClick={() => {
                setEditClient(false),
                  setNewClientErrors(false),
                  document.body.classList.remove('overflow-hidden');
              }}
              size='xs'
              variant='primary'
            >
              close
            </Button>
          </div>

          <div className='mt-2 flex flex-col gap-1.5'>
            <div className=' flex gap-1'>
              <TextInput
                defaultValue={client.data.first_name}
                onChange={(e) => {
                  setEditClientData({
                    ...editClientData,
                    first_name: e.target.value,
                  });
                }}
                placeholder='First Name *'
              />
              <TextInput
                defaultValue={client.data.last_name}
                onChange={(e) => {
                  setEditClientData({
                    ...editClientData,
                    last_name: e.target.value,
                  });
                }}
                placeholder='Last Name'
              />
            </div>

            <TextInput
              defaultValue={client.data.email}
              onChange={(e) => {
                setEditClientData({
                  ...editClientData,
                  email: e.target.value,
                });
              }}
              placeholder='Email *'
            />

            <div className=' flex flex-col gap-0.5'>
              <span className=' px-2 text-[10px]'>Date of birth</span>
              <input
                className='  h-10 rounded-md border border-tremor-border bg-tremor-background px-2 text-tremor-content  outline-none hover:bg-tremor-background-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-background-muted'
                type='date'
                defaultValue={client.data.dob}
                onChange={(e) => {
                  setEditClientData({
                    ...newClientData,
                    dob: e.target.value,
                  });
                }}
                label='Date of Birth'
                placeholder='DoB'
              ></input>
            </div>

            <NumberInput
              defaultValue={client.data.age}
              onChange={(e) => {
                setEditClientData({
                  ...editClientData,
                  age: e.target.value,
                });
              }}
              placeholder='Age'
            />
            <Select placeholder={`${client.data.status}`}>
              <SelectItem
                onClick={() => {
                  setEditClientData({
                    ...editClientData,
                    status: 'active',
                  });
                }}
                value='active'
              >
                Active
              </SelectItem>
              <SelectItem
                onClick={() => {
                  setEditClientData({
                    ...editClientData,
                    status: 'suspended',
                  });
                }}
                value='suspended'
              >
                suspended
              </SelectItem>
            </Select>
            <TextInput
              defaultValue={client.data.password}
              onChange={(e) => {
                setEditClientData({
                  ...editClientData,
                  password: e.target.value,
                });
              }}
              placeholder='Password *'
            />
            <NumberInput
              defaultValue={client.data.initial_weight}
              onChange={(e) => {
                setEditClientData({
                  ...editClientData,
                  initial_weight: e.target.value,
                });
              }}
              placeholder='Initial weight in kg'
            />
            <NumberInput
              defaultValue={client.data.height}
              onChange={(e) =>
                setEditClientData({
                  ...editClientData,
                  height: e.target.value,
                })
              }
              placeholder='Height in cm'
            />

            <Button
              onClick={() => {
                handelEditClient(),
                  setEditClient(false),
                  document.body.classList.remove('overflow-hidden');
              }}
              className='mt-2'
              size='xs'
              variant='primary'
            >
              update Client Info
            </Button>
          </div>
          <Button
            onClick={() => {
              setSchedule(true),
                setEditClient(false),
                document.body.classList.remove('overflow-hidden');
              router.push(`/dashboard/admin/${client.data.id}`);
            }}
            className=' mt-2 w-full'
          >
            Client Schedule
          </Button>
        </div>
      )}
    </>
  );
}
