document.addEventListener('DOMContentLoaded', () => {

    const fields = document.querySelectorAll('.input-box > input, .input-box > select'),
        checks = document.querySelectorAll('.check-box > input'),
        contactForm = document.querySelector('.simple-form'),
        container = document.querySelector('.contact-form'),
        modal = document.querySelector('.modal-window'),
        ret = document.querySelector('.return');


    // disable input quotes
    (() => {
        const inputs = document.querySelectorAll('.input-box > input, .input-box > textarea');

        inputs.forEach((el, i) => {
            inputs[i].onkeypress = (e) => {
                if (e.charCode === 34 || e.charCode === 39) {
                    return false;
                }
            }
        })
    })();

    // email validation
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    // empty field validation
    function validateEmpty(field) {
        return field !== '';
    }

    // forbidden symbol validation
    function validateForbidden(field) {
        const re = /^[^<>%$]*$/;
        return field.length > 3 && re.test(field)
    }

    // password validation
    function validatePassword(password) {
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return re.test(password);
    }

    // radio button validation
    function validateCheck(field) {
        return field.checked;
    }

    // create and append error label
    function createError(text, field) {

        const err = document.createElement('label');
        err.className = 'error';
        err.innerHTML = text;
        field.parentElement.appendChild(err);
        field.parentElement.classList.add('invalid');

    }

    // remove arrow label
    function removeError(field) {

        const err = field.parentElement.childNodes;
        if (err[err.length - 1].className === 'error') {
            err[err.length - 1].remove();
            field.parentElement.classList.remove('invalid');
        }
    }

    // return text for error label
    function checkValidation(field) {

        if (field.value === '') {

            return "field can't be empty";

        } else {

            return field.getAttribute('data-error');

        }

    }

    // action for different validation types when click submit
    function mainAction(field, res, validationType) {
        removeError(field);
        createError(checkValidation(field), field);
        if (validationType(field.value)) {
            removeError(field);
        }
        res = res && validationType(field.value);
        return res;
    }

    // clear all fields
    function clearFields() {

        fields.forEach((el, i) => {

            setTimeout(() => {

                fields[i].value = '';

            }, 1000);

        });

        checks.forEach((el, i) => {

            setTimeout(() => {

                fields[i].checked = false;

            }, 1000);

        });

    }

    // submit action on form button
    contactForm.addEventListener('submit', (e) => {

        e.preventDefault();

        let result = true;

        fields.forEach((el, i) => {

            if (fields[i].className === 'validate_email') {
                result = mainAction(fields[i], result, validateEmail);
            } else if (fields[i].className === 'validate_empty') {
                result = mainAction(fields[i], result, validateEmpty);
            } else if (fields[i].className === 'validate_password') {
                result = mainAction(fields[i], result, validatePassword);
            } else if (fields[i].className === 'validate_forbidden') {
                result = mainAction(fields[i], result, validateForbidden);
            }
        });

        // only if one radio checked, it will return true

        let count = 0;

        checks.forEach((e, i) => {

            if (validateCheck(checks[i])) {
                count++;
            }

        });

        if (count === 0) {
            const err = document.createElement('label');
            const childList = checks[0].parentNode.parentNode.childNodes;
            err.className = 'error';
            err.innerHTML = 'choose on of items';
            if (childList[childList.length - 1].className !== 'error') {
                checks[0].parentNode.parentNode.appendChild(err);
            }
            result = result && false;
        } else {
            const err = checks[0].parentNode.parentNode.childNodes;
            if (err[err.length - 1].className === 'error') {
                err[err.length - 1].remove();
            }
        }
        // if all form is valid

        if (result) {

            clearFields();
            container.classList.add('hide');
            modal.classList.add('show');

        }

    });

    // click on modal button
    ret.addEventListener('click', () => {

        modal.classList.remove('show');
        setTimeout(()=> {
            container.classList.remove('hide');
        }, 500)
    });

});


