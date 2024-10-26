document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const movesDisplay = document.getElementById('moves')
    const width = 8
    const squares = []
    let score = 0
    let moves = 50

    const candyColors = [
        'url(images/blue-candy.png)',
        'url(images/green-candy.png)',
        'url(images/orange-candy.png)',
        'url(images/purple-candy.png)',
        'url(images/red-candy.png)',
        'url(images/yellow-candy.png)'
    ]

    function createBoard() {
        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('draggable', true)
            square.setAttribute('id', i)
            const randomColor = Math.floor(Math.random() * candyColors.length)
            square.style.backgroundImage = candyColors[randomColor]
            grid.appendChild(square)
            squares.push(square)
        }
    }
    createBoard()

    let colorBeingDragged
    let colorBeingReplaced
    let squareIdBeingDragged
    let squareIdBeingReplaced

    squares.forEach(square => {
        square.addEventListener('dragstart', dragStart)
        square.addEventListener('dragend', dragEnd)
        square.addEventListener('dragover', dragOver)
        square.addEventListener('dragenter', dragEnter)
        square.addEventListener('dragleave', dragLeave)
        square.addEventListener('drop', dragDrop)
        square.addEventListener('touchstart', touchStart)
        square.addEventListener('touchmove', touchMove)
        square.addEventListener('touchend', touchEnd)
    });

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage
        squareIdBeingDragged = parseInt(this.id)
    }
    function dragOver(e) {
        e.preventDefault()
    }
    function dragEnter(e) {
        e.preventDefault()
    }
    function dragLeave() {}
    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage
        squareIdBeingReplaced = parseInt(this.id)
        this.style.backgroundImage = colorBeingDragged
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
    }
    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged -1,
            squareIdBeingDragged -width,
            squareIdBeingDragged +1,
            squareIdBeingDragged +width
        ]
        let validMove = validMoves.includes(squareIdBeingReplaced)

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null
            moves--
            movesDisplay.innerHTML = moves
            if (moves === 0) endGame()
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
            squares[squareIdBeingDragged].style.backgroundImage =colorBeingDragged
        } else squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
    }
    
    function touchStart(e) {
        e.preventDefault()
        const touch = e.touches[0]
        const square = document.elementFromPoint(touch.clientX, touch.clientY)
        if (square) {
            dragStart.call(square)
        }
    }

    function touchMove(e) {
        e.preventDefault()
        const touch = e.touches[0]
        const square = document.elementFromPoint(touch.clientX, touch.clientY)
        if (square) {
            dragEnter.call(square, e)
        }
    }

    function touchEnd(e) {
        e.preventDefault()
        const touch = e.changedTouches[0]
        const square = document.elementFromPoint(touch.clientX, touch.clientY)
        if (square) {
            dragDrop.call(square)
            dragEnd.call(square)
        }
    }

    function endGame() {
        const endGameOverlay = document.createElement('div')
        endGameOverlay.classList.add('end-game-overlay')
        endGameOverlay.innerHTML = `
            <div class="end-game-message">
                <p>Game Over!</p>
                <button onclick="location.reload()">
                    REFRESH
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(endGameOverlay)
    }

    function moveDown() {
        for (i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                squares[i].style.backgroundImage = ''
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                const isFirstRow = firstRow.includes(i)
                if (isFirstRow && squares[i].style.backgroundImage === '') {
                    let randomColor = Math.floor(Math.random() * candyColors.length)
                    squares[i].style.backgroundImage = candyColors[randomColor]
                }
            }
        }
    }

    function checkRowForFive() {
        for (i = 0; i < 57; i++) {
            let rowOfFive = [i, i+1, i+2, i+3, i+4]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
            if (notValid.includes(i)) continue

            if (rowOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 5
                scoreDisplay.innerHTML = score
                rowOfFive.forEach(index => {
                    squares[index].style.backgroundImage = ''
                })
            }
        }
    }
    checkRowForFive()

    function checkColumnForFive() {
        for (i = 0; i < 39; i++) {
            let columnOfFive = [i, i+width, i+width*2, i+width*3, i+width*4]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            if (columnOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 5
                scoreDisplay.innerHTML = score
                columnOfFive.forEach(index => {
                    squares[index].style.backgroundImage = ''
                })
            }
        }
    }
    checkColumnForFive()

    function checkRowForFour() {
        for (i = 0; i < 60; i++) {
            let rowOfFour = [i, i+1, i+2, i+3]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
            if (notValid.includes(i)) continue

            if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4
                scoreDisplay.innerHTML = score
                rowOfFour.forEach(index => {
                    squares[index].style.backgroundImage = ''
                })
            }
        }
    }
    checkRowForFour()

    function checkColumnForFour() {
        for (i = 0; i < 47; i++) {
            let columnOfFour = [i, i+width, i+width*2, i+width*3]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4
                scoreDisplay.innerHTML = score
                columnOfFour.forEach(index => {
                    squares[index].style.backgroundImage = ''
                })
            }
        }
    }
    checkColumnForFour()


    function checkRowForThree() {
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i+1, i+2]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
            if (notValid.includes(i)) continue

            if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3
                scoreDisplay.innerHTML = score
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundImage = ''
                })
            }
        }
    }
    checkRowForThree()

    function checkColumnForThree() {
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i+width, i+width*2]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3
                scoreDisplay.innerHTML = score
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundImage = ''
                })
            }
        }
    }
    checkColumnForThree()

    window.setInterval(function() {
        moveDown()
        checkRowForFive()
        checkColumnForFive()
        checkRowForFour()
        checkColumnForFour()
        checkRowForThree()
        checkColumnForThree()
    }, 100)
})