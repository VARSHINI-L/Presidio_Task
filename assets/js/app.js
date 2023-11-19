const firebaseConfig = {
  apiKey: "AIzaSyB68ST-blGDYW564w5PywZzPp3zuK8UUhs",
  authDomain: "teacher-management-67d05.firebaseapp.com",
  projectId: "teacher-management-67d05",
  storageBucket: "teacher-management-67d05.appspot.com",
  messagingSenderId: "547129072828",
  appId: "1:547129072828:web:ea09a058f7683cb5aa04b9",
  measurementId: "G-1B6KWNKF7M"
};





firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const database = firebase.database();
const storage = firebase.storage();

const dbRef = firebase.database().ref('users');


// Buttons 
const signinbtn = document.getElementById('signinbtn');
const signout = document.getElementById('signout');
const addstaf=document.getElementById('addstaf')

// Divisions

const loginpage=document.getElementById('loginpage');
const adminpage=document.getElementById('adminpage');
const displaystaff=document.getElementById('displaystaff');


displaudetail();

// Functions

signinbtn.addEventListener('click', (event) => {
  event.preventDefault();
  signinbtn.style.display = 'none'
  const email=document.getElementById('loginemail').value;
  const password=document.getElementById('loginpassword').value;
  console.log(email,password)
  auth.signInWithEmailAndPassword(email,password).then(cred => {
    document.getElementById('loginemail').value="";
    document.getElementById('loginpassword').value=""
      loginpage.style.display='none';
      adminpage.style.display='block';
      signinbtn.style.display = 'block'
  }).catch(err => {
      swal.fire({
          title : err ,
          icon :'error'
      }).then(() => {
        signinbtn.style.display = 'block'
      })
  })

});

const forgotPwdButton = document.getElementById('forgotpwd');

forgotPwdButton.addEventListener('click', () => {
Swal.fire({
  title: 'Password Reset',
  input: 'email',
  inputLabel: 'Enter your email',
  inputPlaceholder: 'Email address',
  showCancelButton: true,
  inputValidator: (value) => {
    if (!value) {
      return 'You need to enter an email address';
    }
  },
  confirmButtonText: 'Send Reset Email',
}).then((result) => {
  if (result.isConfirmed) {
    const email = result.value;
    auth.sendPasswordResetEmail(email)
      .then(() => {
        Swal.fire('Password Reset Email Sent', 'Check your email for a password reset link.', 'success');
      })
      .catch((error) => {
        Swal.fire('Password Reset Failed', 'Password reset failed. ' + error.message, 'error');
      });
  }
});
});






// add new staff


function generateRandomKey(length) {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let result = '';

for (let i = 0; i < length; i++) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  result += characters.charAt(randomIndex);
}

return result;
}





function calculateAge(birthDate) {
const today = new Date();
const birthDateObj = new Date(birthDate);
let age = today.getFullYear() - birthDateObj.getFullYear();

const monthDiff = today.getMonth() - birthDateObj.getMonth();
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
  age--;
}

return age;
}

addstaf.addEventListener('click', (event) => {
event.preventDefault();

Swal.fire({
  title: 'Add New Staff',
  html:
    '<input id="name" class="swal2-input" placeholder="Name">' +
    '<input id="mobile" class="swal2-input" placeholder="Mobile Number" type="tel">' +
    '<input id="email" class="swal2-input" placeholder="Email ID" type="email">',
  showCancelButton: true,
  confirmButtonText: 'Submit',
  preConfirm: () => {
    const name = Swal.getPopup().querySelector('#name').value;
    const mobile = Swal.getPopup().querySelector('#mobile').value;
    const email = Swal.getPopup().querySelector('#email').value;

    if (!name || !mobile || !email) {
      Swal.showValidationMessage('Please fill in all fields');
    }

    return { name, mobile, email };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const { name, mobile, email} = result.value;

    const minLength = 10;
    const maxLength = 16;
    const randomKeyLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    const generatedKey = generateRandomKey(randomKeyLength);
    console.log(generatedKey);

        firebase.database().ref('users/' + generatedKey).set({
          name: name,
          mobile: mobile,
          email: email,
          uid:generatedKey
        }).then(() => {
          Swal.fire({
            title: 'Success!',
            text: 'Staff Detail Added  successfully',
            icon: 'success'
          });
        }).catch((error) => {
          console.error('Error storing data in the database:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to store user information',
            icon: 'error'
          });
        });
      
  }
});
});


// display the staff details
function displaudetail() {
dbRef.on('value', (snapshot) => {
  displaystaff.innerHTML = '';

  snapshot.forEach((childSnapshot) => {
    const staffdetail = childSnapshot.val();
    const imageUrl = staffdetail.image ? staffdetail.image : 'assets/image/man.png';

    const template = `<div class="col-lg-3 m-2">
        <div class="card">
          <div class="row m-2">
            <img class="card-img-top staffimg col-6 align-self-center" src="${imageUrl}" alt="Profile Image">
            <div class="col-6 card-body"><center>
              <h4 class="card-title">${staffdetail.name}</h4>
              <p class="card-text">${staffdetail.mobile}</p>
              <button class="btn btn-primary" onclick="viewdetail('${staffdetail.uid}')"><i class="bi bi-box-arrow-up-right"></i></button>
              <button class="btn btn-primary" onclick="editdetail('${staffdetail.uid}')"><i class="bi bi-pencil-square"></i></button></center>
            </div>
          </div>
        </div>
      </div>`;

    displaystaff.insertAdjacentHTML('beforeend', template);
  });
});
}


function viewdetail(uid) {
dbRef.child(uid).on('value', (snapshot) => {
  const staffDetail = snapshot.val();
  const average=staffDetail.classcount/5;
  const swalConfig = {
    title: 'Staff Details',
    html: `
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
            <p><strong>Name:</strong> <span class="${staffDetail.name ? '' : 'text-danger'}">${staffDetail.name || 'Not updated'}</span></p>
            <p><strong>Email:</strong> <span class="${staffDetail.email ? '' : 'text-danger'}">${staffDetail.email || 'Not updated'}</span></p>
            <p><strong>Mobile:</strong> <span class="${staffDetail.mobile ? '' : 'text-danger'}">${staffDetail.mobile || 'Not updated'}</span></p>
            <p><strong>Date of Birth:</strong> <span class="${staffDetail.dob ? '' : 'text-danger'}">${staffDetail.dob || 'Not updated'}</span></p>
          </div>
          <div class="col-md-6">
            <p><strong>Date of Join:</strong> <span class="${staffDetail.doj ? '' : 'text-danger'}">${staffDetail.doj || 'Not updated'}</span></p>
            <p><strong>Gender:</strong> <span class="${staffDetail.gender ? '' : 'text-danger'}">${staffDetail.gender || 'Not updated'}</span></p>
            <p><strong>Department:</strong> <span class="${staffDetail.department ? '' : 'text-danger'}">${staffDetail.department || 'Not updated'}</span></p>
            <p><strong>Address:</strong> <span class="${staffDetail.address ? '' : 'text-danger'}">${staffDetail.address || 'Not updated'}</span></p>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <p><strong>Total Experience:</strong> <span class="${staffDetail.experence ? '' : 'text-danger'}">${staffDetail.experence || 'Not updated'}</span></p>
            <p><strong>Average Number of class Taken per day : </strong> <span class="${staffDetail.classcount ? '' : 'text-danger'}">${average || 'Not updated'}</span></p>

            </div>
          <div class="col-md-6">
          <p><strong>Age:</strong> <span class="${staffDetail.age ? '' : 'text-danger'}">${staffDetail.age || 'Not updated'}</span></p>
          <p><strong>Number of class taken per week:</strong> <span class="${staffDetail.classcount ? '' : 'text-danger'}">${staffDetail.classcount || 'Not updated'}</span></p>
          </div>
        </div>
      </div>`,
    
    showCancelButton: true,
    confirmButtonText: 'Close',
    cancelButtonText: 'Delete',
    cancelButtonColor: '#d33',
  };
  Swal.fire(swalConfig).then((result) => {
    if (result.isConfirmed) {
      
    } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
      deleteStaff(uid);
    }
  });
}).catch((error) => {
  console.log(error);
});
}



function deleteStaff(uid) {
  dbRef.child(uid).once('value')
    .then((snapshot) => {
      const staffDetail = snapshot.val();
      const imageURL = staffDetail.image || null;
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will delete the staff member and cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
        confirmButtonColor: '#d33',
        cancelButtonColor: 'gray',
      }).then((result) => {
        if (result.isConfirmed) {
          dbRef.child(uid).remove()
            .then(() => {
              if (imageURL) {
                const storagePath = `profileImages/${uid}`;
                const storageRef = firebase.storage().ref(storagePath);
                storageRef.listAll()
                  .then((listResult) => {
                    const deletePromises = listResult.items.map((itemRef) => {
                      return itemRef.getMetadata()
                        .then(() => itemRef.delete())
                        .catch((error) => {
                          if (error.code !== 'storage/object-not-found') {
                            throw error;
                          }
                        });
                    });
                    Promise.all(deletePromises)
                      .then(() => {
                        Swal.fire('Deleted!', 'Staff details and profile image have been deleted', 'success');
                      })
                      .catch((error) => {
                        console.error('Error deleting items from storage folder:', error);
                        Swal.fire('Deleted!', 'Staff details deleted, but there was an error deleting the image', 'warning');
                      });
                  })
                  .catch((error) => {
                    console.error('Error listing items in storage folder:', error);
                    Swal.fire('Deleted!', 'Staff details deleted, but there was an error listing items in the image folder', 'warning');
                  });
              } else {
                Swal.fire('Deleted!', 'Staff details have been deleted', 'success');
              }
            })
            .catch((error) => {
              console.error('Error deleting data:', error);
            });
        }
      }).catch((error) => {
        console.error('Error in confirmation dialog:', error);
      });
    })
    .catch((error) => {
      console.error('Error retrieving staff details:', error);
    });
}



function editdetail(uid) {
dbRef.child(uid).on('value', (snapshot) => {
  const staffDetail = snapshot.val();
  const swalConfig = {
    title: 'Update Staff Details',
    html: `
    <div class="container mt-5">
      <form>
        <!-- Personal Information -->
        <div class="form-row">
          <div class="form-group col-md-6">
            <input type="text" class="form-control" id="uname" placeholder="Full Name" value="${staffDetail.name || ''}" required>
          </div>
          <div class="form-group col-md-6">
            <input type="tel" class="form-control" id="umobile" placeholder="Mobile Number" value="${staffDetail.mobile || ''}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-6">
            <select id="ugender" class="form-control" required>
              <option ${!staffDetail.gender ? 'selected' : ''} disabled>Select Gender</option>
              <option value="Male" ${staffDetail.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Female" ${staffDetail.gender === 'Female' ? 'selected' : ''}>Female</option>
              <option value="Other" ${staffDetail.gender === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="form-group col-md-6">
            <input type="email" class="form-control" id="uemail" placeholder="Email" value="${staffDetail.email || ''}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="dob">Date of Birth</label>
            <input type="date" class="form-control" id="udob" value="${staffDetail.dob || ''}" required>
          </div>
          <div class="form-group col-md-6">
            <label for="doj">Date of Join</label>
            <input type="date" class="form-control" id="udoj" value="${staffDetail.doj || ''}" required>
          </div>
        </div>


        <div class="form-row">
          <div class="form-group col-md-6">
          <input type="text" class="form-control" id="uclasses" placeholder="Classes per Week" value="${staffDetail.classcount || ''}" required>
          </div>
          <div class="form-group col-md-6">
          <input type="text" class="form-control" id="udepartment" placeholder="Department" value="${staffDetail.department || ''}" required>
          </div>
        </div>
        
        <div class="form-group">
          <textarea class="form-control" rows="4" id="uaddress" placeholder="Address">${staffDetail.address || ''}</textarea>
        </div>

        <div class="form-row"><center>
            <div class="form-group col-md-12">
              <label for="uimage">Profile Image:</label>
              <input type="file" class="form-control-file" id="uimage" accept="image/*">
              <img src="${staffDetail.image || ''}"  id="uimagePreview" style="max-width: 100%; margin-top: 10px;">
            </div></center>
          </div>

      </form>
    </div>
  `,
    showCancelButton: true,
    confirmButtonText: 'Update',
    cancelButtonText: 'Close',
    cancelButtonColor: '#0a58ca;',
  };

  Swal.fire(swalConfig).then((result) => {
    if (result.isConfirmed) {
      if (validateForm()) {
        const fullName = document.getElementById('uname').value;
        const mobileNumber = document.getElementById('umobile').value;
        const gender = document.getElementById('ugender').value;
        const email = document.getElementById('uemail').value;
        const dob = document.getElementById('udob').value;
        const doj = document.getElementById('udoj').value;
        const department = document.getElementById('udepartment').value;
        const classcount = document.getElementById('uclasses').value;
        const address = document.getElementById('uaddress').value;

        const age = calculateAge(dob);
        const experence = calculateAge(doj);
        const imageFile = document.getElementById('uimage').files[0];
        if (imageFile) {
          const storageRef = firebase.storage().ref(`profileImages/${uid}/${imageFile.name}`);
          const uploadTask = storageRef.put(imageFile);

          uploadTask.on('state_changed', 
            (snapshot) => {
            },
            (error) => {
              console.error('Error uploading image:', error);
              Swal.fire('Error!', 'Failed to upload profile image.', 'error');
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                dbRef.child(uid).update({
                  name: fullName,
                  mobile: mobileNumber,
                  gender: gender,
                  email: email,
                  dob: dob,
                  doj: doj,
                  department: department,
                  address: address,
                  age: age,
                  classcount: classcount,
                  experence: experence,
                  image: downloadURL,
                }).then(() => {
                  Swal.fire('Updated!', 'Staff details have been updated.', 'success');
                }).catch((error) => {
                  console.error('Error updating staff details:', error);
                  Swal.fire('Error!', 'Failed to update staff details.', 'error');
                });
              });
            }
          );
        } else {
          dbRef.child(uid).update({
            name: fullName,
            mobile: mobileNumber,
            gender: gender,
            email: email,
            dob: dob,
            doj: doj,
            department: department,
            address: address,
            age: age,
            classcount: classcount,
            experence: experence,
          }).then(() => {
            Swal.fire('Updated!', 'Staff details have been updated.', 'success');
          }).catch((error) => {
            console.error('Error updating staff details:', error);
            Swal.fire('Error!', 'Failed to update staff details.', 'error');
          });
        }
      } else {
        Swal.fire('Error!', 'Please fill in all the required fields.', 'error');
      }
    }
  });
});
}

function validateForm() {
const fullName = document.getElementById('uname').value;
const mobileNumber = document.getElementById('umobile').value;
const gender = document.getElementById('ugender').value;
const email = document.getElementById('uemail').value;
const dob = document.getElementById('udob').value;
const doj = document.getElementById('udoj').value;
const department = document.getElementById('udepartment').value;
const address = document.getElementById('uaddress').value;

return fullName && mobileNumber && gender && email && dob && doj && department && address;
}

document.getElementById('searchdata').addEventListener('click', (event) => {
  event.preventDefault();
  const keyword = document.getElementById('keyword').value.toLowerCase();
  console.log(keyword);
  displaystaff.innerHTML = '';

  if (keyword === '') {
    displaudetail();
  } else {
    const fieldsToSearch = ['name', 'mobile', 'department', 'address', 'dob', 'doj', 'email', 'gender'];
    const uniqueResults = new Set();
    const queryPromises = fieldsToSearch.map((field) => {
      return new Promise((resolve) => {
        dbRef.orderByChild(field).startAt(keyword).endAt(keyword + '\uf8ff').once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const staffdetail = childSnapshot.val();
            uniqueResults.add(staffdetail.uid);
          });
          resolve(); 
        });
      });
    });
    Promise.all(queryPromises)
      .then(() => {
        uniqueResults.forEach(uid => {
          filterdatadisplay(uid);
        });
        console.log('Search completed');
      })
      .catch((error) => {
        console.error('Error during search:', error);
      });
  }
});


function filterstaff(op) {
const html =
  `<select id="filterType" class="swal2-input" onchange="textboxdis()">
   <option value="select">Select Filter Type</option>
   <option value="above">Above</option>
   <option value="below">Below</option>
   <option value="between">Between</option>
  </select>
  <div id="inputContainer">
    <input id="value1" class="swal2-input" placeholder="Value" style="display:none;">
    <input id="value2" class="swal2-input" placeholder="Value" style="display:none;">
  </div>`;

Swal.fire({
  title: 'Filter Staff Members ' + op,
  html: html,
  showCancelButton: true,
  confirmButtonText: 'Filter',
  preConfirm: () => {
    displaystaff.innerHTML = '';
    dbRef.on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const staffdetail = childSnapshot.val();
        const option = document.getElementById('filterType').value;
        const values = staffdetail[op]; 

        if (option == 'between') {
          const value1 = document.getElementById('value1').value;
          const value2 = document.getElementById('value2').value;
          if (values >= value1 && values <= value2) {
            filterdatadisplay(staffdetail.uid);
          }
        } else {
          const value1 = document.getElementById('value1').value;
          if (option == 'above' && values >= value1) {
            filterdatadisplay(staffdetail.uid);
          } else if (option == 'below' && values <= value1) {
            filterdatadisplay(staffdetail.uid);
          }
        }
      });
    });
  },
  onBeforeOpen: () => {
    document.getElementById('value2').style.display = 'none';
  }
});
}

function textboxdis() {
const opt = document.getElementById('filterType').value;
const value1 = document.getElementById('value1');
const value2 = document.getElementById('value2');

if (opt == 'between') {
  value1.style.display = 'block';
  value2.style.display = 'block';
} else if (opt == 'select') {
  value1.style.display = 'none';
  value2.style.display = 'none';
} else {
  value1.style.display = 'block';
  value2.style.display = 'none';
}
}

function filterdatadisplay(uid) {
dbRef.child(uid).on('value', (snapshot) => {
  const staffdetail = snapshot.val();
   const imageUrl = staffdetail.image ? staffdetail.image : 'assets/image/man.png';

   const template = `<div class="col-lg-3 m-2">
       <div class="card">
         <div class="row m-2">
           <img class="card-img-top staffimg col-6 align-self-center" src="${imageUrl}" alt="Profile Image">
           <div class="col-6 card-body"><center>
             <h4 class="card-title">${staffdetail.name}</h4>
             <p class="card-text">${staffdetail.mobile}</p>
             <button class="btn btn-primary" onclick="viewdetail('${staffdetail.uid}')"><i class="bi bi-box-arrow-up-right"></i></button>
             <button class="btn btn-primary" onclick="editdetail('${staffdetail.uid}')"><i class="bi bi-pencil-square"></i></button></center>
           </div>
         </div>
       </div>
     </div>`;

   displaystaff.insertAdjacentHTML('beforeend', template);
})

}

function removefilter()
{
displaystaff.innerHTML = '';
displaudetail();
}

signout.addEventListener('click',(event)=>{
event.preventDefault();
adminpage.style.display='none';
loginpage.style.display='block';

})
