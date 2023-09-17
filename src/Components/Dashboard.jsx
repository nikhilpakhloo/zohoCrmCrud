import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Pagination } from 'react-bootstrap';




const node_url = 'http://localhost:5000';

export default function Dashboard({ mode }) {
    const [data, setData] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedContact, setEditedContact] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        fetch(node_url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((responseData) => {
                setData(responseData.data);
                console.log("fetched data", responseData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleViewClick = (contact) => {
        setSelectedContact(contact);
        setModalIsOpen(true);
        setEditMode(false);
    };

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
    const renderInputField = (label, value, editable, fieldName) => {
        if (editable) {
            return (
                <div className="mb-3">
                    <label className="form-label">{label}:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={value}
                        onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                    />
                </div>
            );
        } else {
            return (
                <div className="mb-3">
                    <label className="form-label">{label}:</label>
                    <span>{value}</span>
                </div>
            );
        }
    };



    const handleSaveClick = () => {

        setData((prevData) => {
            const updatedData = prevData.map((item) => {
                if (item.id === editedContact.id) {

                    return editedContact;
                }
                return item;
            });
            return updatedData;
        });

        closeModal();
    };

    const [currentPage, setCurrentPage] = useState(1);
    const contactsPerPage = 5;



    const filteredData = data.filter((contact) => {
        return (
            contact.Full_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.Email.toLowerCase().includes(searchQuery.toLowerCase())

        );
    });
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = filteredData.slice(
        indexOfFirstContact,
        indexOfLastContact
    );


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
           
            <h4 className='mt-3 ms-3'>Welcome, Nikhil Pakhloo</h4>
            <div className="mt-5 ms-3 mb-3" >
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Contacts"
                    value={searchQuery}

                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="container mt-5">

                <div className={`table-responsive bg-light`}>
                    <table className="table table-striped table-bordered table-hover mb-5">
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
                                        <button className="btn btn-success btn-sm" onClick={() => handleViewClick(item)}>View</button>
                                        <button className="btn btn-primary ms-3 btn-sm" onClick={() => handleEditClick(item)}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

           

            </div>
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
                                {renderInputField("FullName", editedContact.Full_Name, true, "Full_Name")}
                                {renderInputField("Email", editedContact.Email, true, "Email")}
                                {renderInputField("Country", editedContact.Mailing_Country, true, "Mailing_Country")}
                                {renderInputField("City", editedContact.Mailing_City, true, "Mailing_City")}
                                {renderInputField("Street", editedContact.Mailing_Street, true, "Mailing_Street")}
                                {renderInputField("PostalCode", editedContact.Mailing_Zip, true, "Mailing_Zip")}
                                {renderInputField("Department", editedContact.Department, true, "Department")}
                                {renderInputField("Designation", editedContact.Title, true, "Title")}
                                {renderInputField("Twitter", editedContact.Twitter, true, "Twitter")}
                                {renderInputField("SkypeId", editedContact.Skype_ID, true, "Skype_ID")}



                                <div className='d-flex justify-content-center'>
                                    <button onClick={handleSaveClick} className='btn btn-primary btn-sm mt-3 ms-3'>Save</button>
                                </div>
                            </form>
                        ) : (
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>First Name:</td>
                                        <td>{selectedContact.First_Name}</td>
                                    </tr>
                                    <tr>
                                        <td>Last Name:</td>
                                        <td>{selectedContact.Last_Name}</td>
                                    </tr>
                                    <tr>
                                        <td>Email:</td>
                                        <td>{selectedContact.Email}</td>
                                    </tr>
                                    <tr>
                                        <td>Department:</td>
                                        <td>{selectedContact.Department}</td>
                                    </tr>
                                    <tr>
                                        <td>Designation:</td>
                                        <td>{selectedContact.Title}</td>
                                    </tr>
                                    <tr>
                                        <td>Twitter:</td>
                                        <td>{selectedContact.Twitter}</td>
                                    </tr>
                                    <tr>
                                        <td>Skype:</td>
                                        <td>{selectedContact.Skype_ID}</td>
                                    </tr>
                                    <tr>
                                        <td>Country:</td>
                                        <td>{selectedContact.Mailing_Country}</td>
                                    </tr>
                                    <tr>
                                        <td>City:</td>
                                        <td>{selectedContact.Mailing_City}</td>
                                    </tr>
                                    <tr>
                                        <td>Street:</td>
                                        <td>{selectedContact.Mailing_Street}</td>
                                    </tr>
                                    <tr>
                                        <td>Postal Code:</td>
                                        <td>{selectedContact.Mailing_Zip}</td>
                                    </tr>
                                    <tr>
                                        <td>Review Process:</td>
                                        <td>{`Approve:${selectedContact.$review_process.approve},Reject:${selectedContact.$review_process.reject},Resubmit:${selectedContact.$review_process.resubmit}`}</td>
                                    </tr>
                                    <tr>
                                        <td>Account Name & ID:</td>
                                        <td>{`${selectedContact.Account_Name.name} : ${selectedContact.Account_Name.name}`}</td>
                                    </tr>
                                    <tr>
                                        <td>Last Activity:</td>
                                        <td>{selectedContact.Last_Activity_Time}</td>
                                    </tr>
                                    <tr>
                                        <td>Approval Status:</td>
                                        <td>{`Delegate:${selectedContact.$approval.delegate} ,Approved:${selectedContact.$approval.approve} ,Rejected:${selectedContact.$approval.reject} ,Resubmitted: ${selectedContact.$approval.resubmit}`}</td>
                                    </tr>
                                    <tr>
                                        <td>Created by:</td>
                                        <td>{`${selectedContact.Created_By.name} ${selectedContact.Created_By.id} ${selectedContact.Created_By.email}`}</td>
                                    </tr>
                                    <tr>
                                        <td>Modified By:</td>
                                        <td>{`${selectedContact.Modified_By.name} ${selectedContact.Modified_By.id} ${selectedContact.Modified_By.email}`}</td>
                                    </tr>
                                    <tr>
                                        <td>Owner:</td>
                                        <td>{`${selectedContact.Owner.name} ${selectedContact.Owner.id} ${selectedContact.Owner.email}`}</td>
                                    </tr>

                                </tbody>
                            </table>
                        )}
                        <div className='d-flex justify-content-center'>
                            <button onClick={closeModal} className='btn btn-secondary btn-sm mt-3 ms-3'>Close</button>
                        </div>
                    </div>
                )}
            </ReactModal >
            <div className="d-flex justify-content-center">
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
