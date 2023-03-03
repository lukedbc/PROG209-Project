const authorizeUrl = ["#join-a-team", "#signature-dishes", "#dashboard"]
const dishStorage = new Storage("dish-data", JSON.parse(getValueFromCache("dish-data")));

let currentSignUpEntity;
let signInFlag = false;

function fetchCurrentSignInEntity() {
    const value = getValueFromCache("sign-in-entity");
    if (value) {
        return makeContestantFromCache(JSON.parse(value));
    }
    return null;
}

function toggleContent({ show }) {
    if (show === true) {
        getElement("join-a-team-content").style = "display: block;";
        getElement("signature-dishes-content").style = "display: block;";
        getElement("dashboard-content").style = "display: block;";
    } else {
        getElement("join-a-team-content").style = "display: none;";
        getElement("signature-dishes-content").style = "display: none;";
        getElement("dashboard-content").style = "display: none;";
    }
}

function displayUserInfo() {
    let divs = document.querySelectorAll(".signInInfo");
    divs.forEach(function(element) {
        if (currentSignUpEntity) {
            element.innerHTML = "Your name: " + currentSignUpEntity.getName();
        }
    })
}

function handleSignUp(e) {
    handleInputTemplate(e, function(_) {
        let signUpEntity = {
            _studentId: getValueFromInputElement("sID"),
            _firstName: getValueFromInputElement("firstName"),
            _lastName: getValueFromInputElement("lastName"),
            _gender: getValueFromInputElement("gender"),
            _major: getValueFromInputElement("major"),
            _dob: getValueFromInputElement("birthday"),
            _experience: getValueFromInputElement("background"),
            _reason: getValueFromInputElement("reason"),
            _other: getValueFromInputElement("extra"),
        };

        $.ajax({
            type: "POST",
            url: "/users/sign-up",
            data: signUpEntity,
        }).done(function(msg) {
            putValueToCache("sign-in-entity", JSON.stringify(msg));
            currentSignUpEntity = fetchCurrentSignInEntity();
            toggleContent({ show: true });
            getElement("dish-display").innerHTML = "";

            signInFlag = true;
            alert("Sign up sucessful!");
            window.location = "#join-a-team";
        }).fail(function(err) {
            if (!err.responseText) {
                alert("Something went wrong when signed up. Try it later");
            }
            alert(err.responseText);
        });
    })
}

function handleAddDish(e) {
    handleInputTemplate(e, function(_) {
        let dish = new ContactDish({
            _contestantId: currentSignUpEntity.getId(),
            _title: getValueFromInputElement("title"),
            _picture: getValueFromInputElement("picture"),
            _difficulty: getValueFromInputElement("dishes-difficulty"),
            _description: getValueFromInputElement("description"),
            _recipe: getValueFromInputElement("recipe")
        });

        if (dish.isValid()) {
            dishStorage.add(dish);
            dishStorage.saveToCache();
            alert("Your signature dish has been published!");

            getElement("title").value = "";
            getElement("picture").value = "";
            getElement("dishes-difficulty").value = "";
            getElement("description").value = "";
            getElement("recipe").value = "";
        }
    })
}

function handleShowDish(_) {
    dishStorage.syncWithCache();
    let dishesByUser = dishStorage.filter(function(dish) {
        return dish.m_contestantId === currentSignUpEntity.m_id;
    });

    let gallery = getElement("dish-display");
    gallery.innerHTML = "";
    dishesByUser.forEach(function(dish) {
        let div = document.createElement("div");
        div.setAttribute("id", "dish-" + dish.m_id);
        div.setAttribute("data-rel", "popup");
        div.setAttribute("data-transition", "pop");
        div.innerHTML = `
            <a href="#image-pop-up" data-rel="popup" 
                class="ui-btn ui-corner-all ui-shadow ui-btn-inline" 
                data-position-to="window"
                data-transition="pop">
                <img src=${dish.m_picture} id="img-dish-${dish.m_id} width='400' height='300'"/>
            </a>
        `
        div.addEventListener("click", function(e) {
            getElement("one_dish_title").value = dish.m_title;
            getElement("one_dish_difficulty").value = dish.m_difficulty;
            getElement("one_dish_description").value = dish.m_description;
            getElement("one_dish_recipe").value = dish.m_recipe;
        });
        gallery.appendChild(div);
    });
}

function handleSignIn(e) {
    handleInputTemplate(e, function(_) {

        let signIn = {
            studentId: getValueFromInputElement("si_sID"),
            firstName: getValueFromInputElement("si_firstName"),
            lastName: getValueFromInputElement("si_lastName")
        };
        // call HTTP sign in request 
        $.ajax({
            type: "POST",
            url: "/users/sign-in",
            data: signIn,
        }).done(function(msg) {
            putValueToCache("sign-in-entity", JSON.stringify(msg));
            currentSignUpEntity = fetchCurrentSignInEntity();
            toggleContent({ show: true });
            getElement("dish-display").innerHTML = "";

            signInFlag = true;
            window.location = "#join-a-team";
        }).fail(function(err) {
            alert("No Registration Record Found");
        })
    });
}

function fillSignInInfoToPopup(model) {
    getElement("one_sID").value = model.m_studentId;
    getElement("one_firstName").value = model.m_firstName;
    getElement("one_lastName").value = model.m_lastName;
    getElement("one_major").value = model.m_major; getElement("one_gender").value = model.m_gender;
    getElement("one_birthday").value = model.m_dob;
    getElement("one_background").value = model.m_experience;
    getElement("one_reason").value = model.m_reason;
    getElement("one_extra").value = model.m_other;
}

function handleSignUpListBtn(_) {
    $.ajax({
        type: "GET",
        url: "/users/list",
    }).done(function(data) {
        show("sign-up-list", data, "popup-sign-in-info", function(model) {
            return `${model.m_createdDate}: Name - ${model.m_firstName} ${model.m_lastName}, DOB: ${model.m_dob}`;
        }, function(model) {
            fillSignInInfoToPopup(model);
        });
    }).fail(function(err) {
        alert("No Record Found");
    })
}

function show(elementId, data, popupId, toStringFunction, clickHandleFunction) {
    let rootElement = getElement(elementId);
    rootElement.innerHTML = "";
    data.forEach(function(dataAsString, index) {
        let liElement = document.createElement("li");
        liElement.setAttribute("id", elementId + "-" + index);
        liElement.setAttribute("data-rel", "popup");
        liElement.setAttribute("data-transition", "pop");
        liElement.innerHTML = `
            <a href="#${popupId}" data-rel="popup" 
                class="ui-btn ui-corner-all ui-shadow ui-btn-inline" 
                data-position-to="window"
                data-transition="pop">
            ${toStringFunction(dataAsString)}
            </a>
        `
        liElement.addEventListener("click", function(_) {
            clickHandleFunction(dataAsString);
        });

        rootElement.appendChild(liElement);
    });
}

function handleInputTemplate(e, handleFunction) {
    e.preventDefault();
    try {
        handleFunction(e);
    } catch (e) {
        console.log(e);
        alert(e.message);
    }
}

function initMatrix() {

    drawMatrixTo("join-a-team-content-matrix");
    // sync cache 
    // update matrix with new data

    $.ajax({
        type: "GET",
        url: "/member-slot/info",
    }).done(function(data) {
        updateWithMemberSlot(data);
        for (let memberOrder = 1; memberOrder <= NUMBER_MEMBER_EACH_TEAM; memberOrder++) {
            for (let team = 1; team <= NUMBER_OF_TEAM; team++) {
                addEventToSlot({
                    _team: team,
                    _memberOrder: memberOrder,
                    _handleFunction:
                        function() {
                            const newText = currentSignUpEntity.m_firstName + " " + currentSignUpEntity.m_lastName + ". Major: " + currentSignUpEntity.m_major;
                            $.ajax({
                                type: "POST",
                                url: "/member-slot/assign",
                                data: {
                                    team: team,
                                    memberOrder: memberOrder,
                                    text: newText,
                                    contestantId: currentSignUpEntity.m_id
                                }
                            }).done(function(msg) {
                                if (msg === "success") {
                                    location.reload(true);
                                }
                            }).fail(function(err) {
                                if (!err) {
                                    alert("Something went wrong when assigned slot. Try again later");
                                    return;
                                }
                                alert(err.responseText);
                            });
                        }
                });
            }
        }
    }).fail(function(err) {
        alert("No Record Found");
    })

}


function checkSignInStatus() {
    let url = window.location.href;
    if (signInFlag == false) {
        currentSignUpEntity = fetchCurrentSignInEntity();
        if (currentSignUpEntity && currentSignUpEntity.m_id) {
            signInFlag = true;
        }
    }
    if (signInFlag === true) {
        displayUserInfo();
    }
    let match = authorizeUrl.find(_url => url.endsWith(_url));
    if (match && signInFlag === false) {
        alert("You must sign in first");
        toggleContent({ show: signInFlag });
        return;
    }
    if (match && signInFlag === true) {
        toggleContent({ show: signInFlag });
        if (match !== "#signature-dishes") {
            getElement("dish-display").innerHTML = "";
        }
        return;
    }
}

document.addEventListener("DOMContentLoaded", function(_) {
    checkSignInStatus();
    initMatrix();
    getElement("sign-up-btn").addEventListener("click", handleSignUp);
    getElement("sign-in-btn").addEventListener("click", handleSignIn);

    getElement("sign-up-list-btn").addEventListener("click", handleSignUpListBtn);

    getElement("add-recipe-btn").addEventListener("click", handleAddDish);
    getElement("your-dishes-btn").addEventListener("click", handleShowDish);
});

window.addEventListener("hashchange", function(_) {
    checkSignInStatus();
})
