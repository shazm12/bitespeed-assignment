-- Schema For the Customer Contact Detials Tables
CREATE TABLE IF NOT EXISTS CustContactDetials (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
    linkedId INT,
    linkPrecedence ENUM('primary', 'secondary') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL,
    FOREIGN KEY (linkedId) REFERENCES Contacts(id)
);