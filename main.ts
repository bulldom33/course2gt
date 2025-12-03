let Chrono = 0
let HorodateurFin = 0
let HorodateurDebut = 0
let NumEtape = 0
let idcarte = 0
let depart = 0
led.enable(true)
let TempsDecompte = 10
lcd1602.setAddress(
lcd1602.I2C_ADDR.addr1
)
lcd1602.clear()
serial.writeValue("numEtape", NumEtape)
MFRC522.Init()
lcd1602.putString(
"voiture ligne",
0,
0
)
lcd1602.putString(
"Scan identite",
0,
1
)
basic.forever(function () {
    if (NumEtape == 0) {
        basic.clearScreen()
        TempsDecompte = 5
        idcarte = MFRC522.getID()
        if (idcarte != 0) {
            let data = ""
            basic.pause(2000)
            lcd1602.putNumber(
            idcarte,
            0,
            1
            )
            lcd1602.putString(
            data,
            0,
            0
            )
            basic.pause(5000)
        }
        if (idcarte != 0) {
            NumEtape = 1
            serial.writeValue("numEtape", NumEtape)
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
            serial.writeValue("numEtape", NumEtape)
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
            serial.writeValue("numEtape", NumEtape)
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
            HorodateurDebut = control.millis()
            serial.writeValue("debut", HorodateurDebut)
        }
    }
    if (NumEtape == 3) {
        TempsDecompte += 1
        serial.writeValue("p3", pins.analogReadPin(AnalogReadWritePin.P0))
        if (pins.analogReadPin(AnalogReadWritePin.P0) < 200) {
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
            HorodateurFin = control.millis()
            serial.writeValue("Fin", HorodateurFin)
            serial.writeValue("debut", HorodateurDebut)
            NumEtape = 4
            serial.writeValue("numEtape", NumEtape)
        }
    }
    if (NumEtape == 4) {
        Chrono = (HorodateurFin - HorodateurDebut) / 1
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
            serial.writeValue("numEtape", NumEtape)
            lcd1602.clear()
            lcd1602.putString(
            "voiture ligne",
            0,
            0
            )
            lcd1602.putString(
            "Scan identite",
            0,
            1
            )
        }
    }
})
