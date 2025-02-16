const CARD_TYPES = {
    '⚔️ Меч': { type: 'attack', value: 3 },
    '❤️ Лечение': { type: 'heal', value: 2 },
    '🔮 Манна': { type: 'mana', value: 2 },
    '🐉 Дракон': { type: 'attack', value: 5 },
    '🛡️ Щит': { type: 'defense', value: 2 },
    '🌀 Сфера': { type: 'special', value: 4 }
}

class Game {
    constructor() {
        this.player = {
            hp: 100,
            mana: 0,
            hand: [],
            nextCard: null
        }
        this.enemyHP = 100
        this.notification = {
            show: false,
            text: ''
        }
        this.initHand()
    }

    initHand() {
        this.player.hand = Array.from({ length: 5 }, () => this.generateNewCard())
        this.player.nextCard = this.generateNewCard()
    }

    generateNewCard() {
        return Object.keys(CARD_TYPES)[
            Math.floor(Math.random() * Object.keys(CARD_TYPES).length)
        ]
    }

    replaceCard(index) {
        if (index < 5) {
            const discarded = this.player.hand[index]
            this.player.hand[index] = this.player.nextCard
            this.player.nextCard = this.generateNewCard()
            return discarded
        } else {
            this.player.nextCard = this.generateNewCard()
            return null
        }
    }

    showNotification(text) {
        this.notification.text = text
        this.notification.show = true
        setTimeout(() => this.notification.show = false, 1900)
    }

    processEnemyTurn(discardedCard) {
        if (Math.random() < 0.3) {
            const damage = Math.floor(Math.random() * 5) + 1
            this.player.hp = Math.max(0, this.player.hp - damage)
            this.showNotification(`👾 Противник атакует! -${damage}HP`)
        }
    }

    calculateAttack() {
        let attack = 0
        let defense = 0
        let healing = 0

        this.player.hand.forEach(card => {
            const { type, value } = CARD_TYPES[card]
            switch(type) {
                case 'attack': attack += value; break
                case 'defense': defense += value; break
                case 'heal': healing += value; break
            }
        })

        return {
            damage: Math.max(0, attack - defense),
            healing: healing
        }
    }

    attack() {
        const { damage, healing } = this.calculateAttack()
        this.enemyHP = Math.max(0, this.enemyHP - damage)
        this.player.hp = Math.min(100, this.player.hp + healing)
        this.showNotification(`⚡ Ваша атака! -${damage} 👾`)
        this.initHand()
    }
}

document.addEventListener('alpine:init', () => {
    Alpine.data('game', () => ({
        game: Alpine.reactive(new Game()),
        
        processClick(index) {
            if (index >= 0 && index < 6) {
                const discarded = this.game.replaceCard(index)
                if (discarded) {
                    this.game.processEnemyTurn(discarded)
                }
            }
        }
    }))
})