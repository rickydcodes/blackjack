let playerScoreParagraph = document.querySelectorAll(".title")[1]
let dealerScoreParagraph = document.querySelectorAll(".title")[2]
let betDiv = document.getElementById("betDiv")
let betInput = document.getElementById("betInput")
let placeBetButton = document.getElementById("placeBetButton")
let moneyParagraph = document.getElementById("moneyParagraph")
let playerCards = document.getElementById("playerCards")
let dealerCards = document.getElementById("dealerCards")
let hitButton = document.getElementById("hitButton")
let standButton = document.getElementById("standButton")
let dealButton = document.getElementById("dealButton")

let ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
let suits = ["D", "H", "S", "C"]

let deck = []
let playerHand = []
let dealerHand = []
let money = 100
let bet = 0
let roundOver = true
let playerTurn = false

placeBetButton.addEventListener("click", placeBet)
dealButton.addEventListener("click", deal)
hitButton.addEventListener("click", hit)
standButton.addEventListener("click", stand)

function placeBet() {
    let betValue = parseInt(betInput.value, 10)

    if (!isNaN(betValue) && betValue >= 10 && betValue <= money) {
        bet = betValue
        money -= bet

        moneyParagraph.innerHTML = `$${money.toFixed(2)}`
        betInput.value = ""
        betDiv.style.display = "none"
        dealButton.style.display = "inline-block"
    }
}

function deal() {
    if (roundOver) {
        roundOver = false
        deck = createDeck()
        playerHand = []
        dealerHand = []

        playerCards.innerHTML = ""
        dealerCards.innerHTML = ""
        playerScoreParagraph.innerHTML = "Player's score: 0"
        dealerScoreParagraph.innerHTML = "Dealer's score: ?"

        dealCard(playerHand, playerCards)
        setTimeout(() => dealCard(dealerHand, dealerCards, true), 1000)
        setTimeout(() => dealCard(playerHand, playerCards), 2000)

        setTimeout(() => {
            dealCard(dealerHand, dealerCards)
            playerTurn = true

            dealButton.style.display = "none"
            hitButton.style.display = "inline-block"
            standButton.style.display = "inline-block"
        }, 3000)
    }
}

function hit() {
    if (playerTurn) {
        dealCard(playerHand, playerCards)
        let playerScore = calculateScore(playerHand).score

        if (playerScore > 21) {
            endPlayerTurn()
            playerScoreParagraph.innerHTML = `Player busted with ${playerScore}`
            dealerScoreParagraph.innerHTML = `Dealer wins with ${calculateScore(dealerHand).score}`
            endRound()
        }
    }
}

function stand() {
    if (playerTurn) {
        endPlayerTurn()
        playerScoreParagraph.innerHTML = `Player is standing with a score of ${calculateScore(playerHand).score}`
        playDealer()
    }
}

function playDealer() {
    let dealer = calculateScore(dealerHand)
    let playerScore = calculateScore(playerHand).score

    if (dealer.score > 21) {
        dealerScoreParagraph.innerHTML = `Dealer busted with ${dealer.score}`
        playerScoreParagraph.innerHTML = `Player wins with ${playerScore}`
        money += bet * 2
        endRound()
    } else if (dealer.score < 17 || (dealer.score == 17 && dealer.soft)) {
        setTimeout(() => {
            dealCard(dealerHand, dealerCards)
            playDealer()
        }, 1000)
    } else {
        dealerScoreParagraph.innerHTML = `Dealer is standing with a score of ${dealer.score}`

        if (playerScore > dealer.score) {
            playerScoreParagraph.innerHTML = `Player wins with ${playerScore}`
            money += bet * 2
        } else if (playerScore < dealer.score) {
            dealerScoreParagraph.innerHTML = `Dealer wins with ${dealer.score}`
        } else {
            playerScoreParagraph.innerHTML = "Tie game"
            dealerScoreParagraph.innerHTML = "Tie game"
            money += bet
        }

        endRound()
    }
}

function endPlayerTurn() {
    playerTurn = false
    dealerCards.querySelector(".card img").src = cardImage(dealerHand[0])

    hitButton.style.display = "none"
    standButton.style.display = "none"
}

function endRound() {
    roundOver = true

    moneyParagraph.innerHTML = `$${money.toFixed(2)}`
    betDiv.style.display = "inline-block"
}

function dealCard(hand, cardsDiv, faceDown) {
    let card = deck.pop()
    hand.push(card)

    let cardDiv = document.createElement("div")
    cardDiv.classList.add("card")
    cardsDiv.appendChild(cardDiv)

    let img = document.createElement("img")
    img.src = faceDown ? "cards/facedown.png" : cardImage(card)
    cardDiv.appendChild(img)

    if (hand == playerHand) {
        playerScoreParagraph.innerHTML = `Player's score: ${calculateScore(playerHand).score}`
    }
}

function cardImage(card) {
    return `cards/${card.rank}${card.suit}.png`
}

function createDeck() {
    let newDeck = []

    for (let rank of ranks) {
        for (let suit of suits) {
            newDeck.push({ rank, suit })
        }
    }

    for (let i = newDeck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = newDeck[i]
        newDeck[i] = newDeck[j]
        newDeck[j] = temp
    }

    return newDeck
}

function calculateScore(hand) {
    let score = 0
    let aces = 0

    for (let card of hand) {
        if (card.rank == "A") {
            score += 1
            aces++
        } else if (["J", "Q", "K"].includes(card.rank)) {
            score += 10
        } else {
            score += Number(card.rank)
        }
    }

    let soft = aces > 0 && score + 10 <= 21

    if (soft) {
        score += 10
    }

    return { score, soft }
}