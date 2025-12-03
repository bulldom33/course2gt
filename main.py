HorodateurFin = 0
HorodateurDebut = 0
led.enable(True)
NumEtape = 0
TempsDecompte = 10
depart = 0
lcd1602.set_address(lcd1602.I2C_ADDR.ADDR1)
lcd1602.clear()
Chrono = 0



def on_forever():
    global TempsDecompte, NumEtape, HorodateurDebut, HorodateurFin, Chrono
    serial.write_value("numEtape", NumEtape)
    serial.write_value("p3", pins.digital_read_pin(DigitalPin.P3))
    if NumEtape == 0:
        basic.clear_screen()
        TempsDecompte = 5
        if True:
            NumEtape = 1
            basic.show_icon(IconNames.YES)
            lcd1602.clear()
            lcd1602.put_string("GO - Ligne - GO", 0, 0)
            lcd1602.put_string("bt.Sens. demarrer", 0, 1)
    if NumEtape == 1:
        TempsDecompte = 5
        if input.logo_is_pressed():
            NumEtape = 2
            lcd1602.clear()
            lcd1602.put_string("Pilotes", 4, 0)
            lcd1602.put_string("Attention", 2, 1)
            basic.show_icon(IconNames.CHESSBOARD)
    if NumEtape == 2:
        basic.show_number(TempsDecompte)
        TempsDecompte += -1
        if TempsDecompte == 0:
            NumEtape = 3
            lcd1602.clear()
            lcd1602.put_string("GO", 0, 0)
            lcd1602.put_string("c'est parti", 0, 1)
            basic.show_icon(IconNames.TORTOISE)
            basic.show_leds("""
                # # # # #
                . . # . .
                . . # . .
                # . # . #
                . . # . .
                """)
            HorodateurDebut = control.event_timestamp()
            serial.write_value("debut", HorodateurDebut)
    if NumEtape == 3:
        TempsDecompte += 1
        if pins.digital_read_pin(DigitalPin.P3) > 0:
            lcd1602.clear()
            lcd1602.put_string("WIN1", 5, 0)
            basic.show_leds("""
                # # # # #
                # . # . .
                . . # . #
                . . # . .
                . . # . .
                """)
            HorodateurFin = control.event_timestamp()
            serial.write_value("Fin", HorodateurFin)
            NumEtape = 4
    if NumEtape == 4:
        Chrono = (HorodateurFin - HorodateurDebut) / 1000
        lcd1602.set_backlight(lcd1602.on_off.ON)
        lcd1602.put_number(Chrono, 0, 1)
        lcd1602.put_string("ms", 12, 1)
        lcd1602.set_backlight(lcd1602.on_off.ON)
        basic.pause(10000)
        if True:
            NumEtape = 0
basic.forever(on_forever)
