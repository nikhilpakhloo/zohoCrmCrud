import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Pagination } from 'react-bootstrap';
import '../index.css'

ReactModal.setAppElement('#root');

const node_url = 'http://localhost:5000';

export default function Dashboard({ mode }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedContact, setEditedContact] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


    // -------------------------------------fetching-data from node server---------------------------------------------------------

    useEffect(() => {
        setTimeout(() => {
            fetch(node_url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((responseData) => {
                    setData(responseData.data);
                    setLoading(false);
                    console.log("fetched data", responseData);
                })
                .catch((error) => {
                    console.error(error);
                });
        }, 3000);
    }, []);


    // --------------------------------------to view all details of contact--------------------------------------------------
    const handleViewClick = (contact) => {
        setSelectedContact(contact);
        setModalIsOpen(true);
        setEditMode(false);
    };
    // -----------------------------------------------------to edit all details of contact------------------------------------------

    const handleEditClick = (contact) => {
        setSelectedContact(contact);
        setModalIsOpen(true);
        setEditMode(true);
        setEditedContact({ ...contact });
    };

    const closeModal = () => {
        setSelectedContact(null);
        setModalIsOpen(false);
        setEditedContact(null);
    };

    const handleFieldChange = (fieldName, value) => {
        setEditedContact({
            ...editedContact,
            [fieldName]: value,
        });
    };

    const renderAllInputFields = (contact) => {
        return Object.keys(contact).map((fieldName) => {
            let value = contact[fieldName];


            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }

            return (
                <div className="mb-3" key={fieldName}>
                    <label className="form-label">{fieldName}:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={value}
                        onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                        readOnly={!editMode}
                    />
                </div>
            );
        });
    };


    //    --------------------------------------------------------to update existing contact------------------------------------------------ 
    const handleSaveClick = (e) => {
        e.preventDefault();
        console.log("Updating Id:", selectedContact.id);
        console.log("Changes made", editedContact);


        const updatedContactData = { ...editedContact };


        axios
            .put(`${node_url}/Contacts/${selectedContact.id}`, updatedContactData)
            .then((response) => {
                console.log('Contact updated successfully:', response.data);

                closeModal();
            })
            .catch((error) => {
                console.error('Error updating contact:', error);
            });
    };

    // ----------------------------------------------to deletespecific contact-----------------------------------------------
    const handleDeleteClick = (contact) => {
        setSelectedContact(contact);


        axios.delete(`${node_url}/Contacts/${contact.id}`)
            .then((response) => {
                console.log("Contact is deleting", response.data);
                window.location.reload();

            })
            .catch((error) => {
                console.error("Error Deleting Contact", error);

            });
    };






    // ------------------------------------to search by name or email--------------------------------------------------

    const filteredData = data.filter((contact) => {
        return (
            contact.Full_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.Email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    //--------------------------------------------to show only 5 contacts per page--------------------------------

    const [currentPage, setCurrentPage] = useState(1);
    const contactsPerPage = 5;

    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = filteredData.slice(
        indexOfFirstContact,
        indexOfLastContact
    );
    // to navigate the pagination view

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

   

    return (
        <>
            <h4 className='mt-3 ms-3'>Welcome, Nikhil Pakhloo</h4>
            <div className="mt-5 ms-3 mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Contacts"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {loading ? (
                <div className="container mt-5">
                    <div className={`table-responsive bg-light`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile Number</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...new Array(5)].map((index) => (
                                    <tr  key={index}>
                                        <td className='animate-pulse'></td>
                                        <td className='animate-pulse'></td>
                                        <td className='animate-pulse'></td>
                                        <td className='animate-pulse'></td>
                                        <td>
                                            <button className="btn btn-lg animate-pulse  " ></button>
                                            <button className="btn ms-3 btn-lg animate-pulse " ></button>

                                            <button className="btn ms-3 btn-lg animate-pulse"></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>) : (

                <div className="container mt-5">
                    <div className={`table-responsive bg-light`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile Number</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentContacts.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.Full_Name}</td>
                                        <td>{item.Email}</td>
                                        <td>{item.Phone}</td>
                                        <td>
                                            <div className='d-flex flex-wrap justify-content-center'>
                                            <button className="dash-btn btn btn-success btn-sm mb-2" onClick={() => handleViewClick(item)}>View</button>
                                            <button className="dash-btn btn btn-primary ms-3 btn-sm mb-2" onClick={() => handleEditClick(item)}>Edit</button>

                                            <button className="dash-btn btn btn-danger ms-3 btn-sm mb-2" onClick={() => handleDeleteClick(item)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Contact Details"
                style={{
                    overlay: {
                        zIndex: 5,
                    }
                }}
            >
                {selectedContact && (
                    <div>
                        <h2 className='d-flex justify-content-center'>{editMode ? "Edit Contact" : "Contact Details"}</h2>
                        {editMode ? (
                            <form>
                                {renderAllInputFields(editedContact)}
                                <div className='d-flex justify-content-center'>
                                    <button onClick={handleSaveClick} className='btn btn-primary btn-sm mt-3 ms-3'>Save</button>
                                </div>
                            </form>
                        ) : (
                            <table className="table table-bordered">
                                <tbody>
                                    {renderAllInputFields(selectedContact)}
                                </tbody>
                            </table>
                        )}
                        <div className='d-flex justify-content-center'>
                            <button onClick={closeModal} className='btn btn-secondary btn-sm mt-3 ms-3'>Close</button>
                        </div>
                    </div>
                )}
            </ReactModal>

            <div className="d-flex justify-content-center mt-3">
                <Pagination>
                    {Array.from({ length: Math.ceil(data.length / contactsPerPage) }, (_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </>
    );
}
