passwordInput = document.getElementById('password')
showPassword = document.getElementById('showPassword')

state = true;

showPassword.addEventListener('click', () => {
    if(state){
        state = !state

        passwordInput.type = 'text'
        
        showPassword.src='./assets/icons/eyeOpen.svg'

    } else {
        state = !state

        passwordInput.type = 'password'
        showPassword.src='./assets/icons/eyeClose.svg'
    }
})

