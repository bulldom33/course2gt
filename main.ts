let HorodateurFin = 0
let HorodateurDebut = 0
led.enable(true)
let NumEtape = 0
let TempsDecompte = 10
let depart = 0
lcd1602.setAddress(
lcd1602.I2C_ADDR.addr1
)
lcd1602.clear()
let Chrono = 0
basic.forever(function () {
    if (NumEtape == 0) {
        basic.clearScreen()
        TempsDecompte = 5
        if (true) {
            NumEtape = 1
            basic.showIcon(IconNames.Yes)
            lcd1602.clear()
            lcd1602.putString(
            "GO - Ligne - GO",
            0,
            0
            )
            lcd1602.putString(
            "bt.Sens. demarrer",
            0,
            1
            )
        }
    }
    if (NumEtape == 1) {
        TempsDecompte = 5
        if (input.logoIsPressed()) {
            NumEtape = 2
            lcd1602.clear()
            lcd1602.putString(
            "Pilotes",
            4,
            0
            )
            lcd1602.putString(
            "Attention",
            2,
            1
            )
            basic.showIcon(IconNames.Chessboard)
        }
    }
    if (NumEtape == 2) {
        basic.showNumber(TempsDecompte)
        TempsDecompte += -1
        if (TempsDecompte == 0) {
            NumEtape = 3
            lcd1602.clear()
            lcd1602.putString(
            "GO",
            0,
            0
            )
            lcd1602.putString(
            "c'est parti",
            0,
            1
            )
            basic.showIcon(IconNames.Tortoise)
            basic.showLeds(`
                # # # # #
                . . # . .
                . . # . .
                # . # . #
                . . # . .
                `)
            HorodateurDebut = control.eventTimestamp()
            serial.writeValue("debut", HorodateurDebut)
        }
    }
    if (NumEtape == 3) {
        TempsDecompte += 1
        if (pins.digitalReadPin(DigitalPin.P0) > 0) {
            lcd1602.clear()
            lcd1602.putString(
            "WIN1",
            5,
            0
            )
            basic.showLeds(`
                # # # # #
                # . # . .
                . . # . #
                . . # . .
                . . # . .
                `)
            HorodateurFin = control.eventTimestamp()
            serial.writeValue("Fin", HorodateurFin)
            NumEtape = 4
        }
    }
    if (NumEtape == 4) {
        Chrono = (HorodateurFin - HorodateurDebut) / 1000
        lcd1602.set_backlight(lcd1602.on_off.on)
        lcd1602.putNumber(
        Chrono,
        0,
        1
        )
        lcd1602.putString(
        "ms",
        12,
        1
        )
        lcd1602.set_backlight(lcd1602.on_off.on)
        basic.pause(10000)
        if (true) {
            NumEtape = 0
        }
    }
})
