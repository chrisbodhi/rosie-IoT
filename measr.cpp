// UPM and MRAA deps to interface with various sensors
#include <mraa/aio.hpp>
#include <mraa/gpio.hpp>
#include <upm/Lcm1602.h>
#include <upm/mic.h>
#include <upm/jhd1313m1.h>
#include <upm/grove.h>
#include <upm/buzzer.h>

// OpenCV to interface w/ USB webcam
#include <opencv2/opencv.hpp>

// C includes
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/time.h>

// CPP includes
#include <iostream>
#include <fstream>

#include "mraa.hpp"
//#include "Lcm1602.h"
//#include "mic.h"
//#include "grove.h"
//#include "mraa/aio.h"

#define MICROPHONE_PIN  0
#define LIGHTSENSOR_PIN 2
#define TEMPSENSOR_PIN  1
#define TOUCHSENSOR_PIN 8
#define BUTTON_PIN      7
#define RELAY_PIN       6
#define ADC_INPUT       3
#define BUZZER_PIN      5
#define PLATE_THRESHOLD 0
#define FILTER_LENGTH 128
// Yeah, let's use these namespaces
using namespace std;
using namespace cv;

// Awesome link: https://stackoverflow.com/questions/478898/how-to-execute-a-command-and-get-output-of-command-within-c
std::string exec(char* cmd) {
    FILE* pipe = popen(cmd, "r");
    if (!pipe) return "ERROR";
    char buffer[128];
    std::string result = "";
    while(!feof(pipe)) {
      if(fgets(buffer, 128, pipe) != NULL)
        result += buffer;
    }
    pclose(pipe);
    return result;
}

//Context, num samples, time between sample in useconds
int filter(mraa_aio_context _ctx, int numsamples, int t_sample) {
    uint16_t adc_value = 0;

    int sum=0;
    for (int i=1;i<numsamples;i++) {
      adc_value = mraa_aio_read(_ctx);
      sum += adc_value ;
      usleep(100);
    }
    int wt = sum/numsamples ;
    return wt ;
}

int get_wt(mraa_aio_context _ctx, int zero_scale_wt) {
  return zero_scale_wt - filter(_ctx,FILTER_LENGTH,100);
}

int get_light(mraa_aio_context _ctx) {
  return filter(_ctx, 32,10);
}


int chord[] = { DO, RE, MI, FA, SOL, LA, SI, DO, SI };

void play_chord( upm::Buzzer * sound ,int start, int end) {
  int i;
    for (i=start ; i <= end ; i++) {
        // play one second for each chord
        std::cout << sound->playSound(chord[i], 100000) << std::endl;
        usleep(100000);
    }
}

int main ()
{
    VideoCapture capture(-1);
    // Camera chokes on this...
    //capture.set(CV_CAP_PROP_FRAME_WIDTH,1920);
    //capture.set(CV_CAP_PROP_FRAME_HEIGHT,1080);
    if(!capture.isOpened()){
        cout << "Failed to connect to the camera." << endl;
    }
    Mat frame;
    std::string imgurUrl;

  int lightAmbient ;
  int lightThreshold ;
  mraa_aio_context lightadc;
    lightadc = mraa_aio_init(LIGHTSENSOR_PIN);
    lightAmbient = filter(lightadc,256,100);
    lightThreshold = lightAmbient/2;

  std::cout << "lightThreshold =" << lightThreshold << std::endl;

  char msg[16];

  //Initialize ADC Input port to read scale.
    mraa_aio_context adc;
    int zero_scale_wt ;
    adc = mraa_aio_init(ADC_INPUT);
    zero_scale_wt = filter(adc,256,100);
    std::cout << "zero scale wt =" << zero_scale_wt << std::endl;

    //Initialize LCD Display
    // 0x62 RGB_ADDRESS, 0x3E LCD_ADDRESS
    upm::Jhd1313m1 *lcd = new upm::Jhd1313m1(0, 0x3E, 0x62);

    //Initialize Buzzer
    upm::Buzzer* sound = new upm::Buzzer(BUZZER_PIN);

    //Upm light sensor class has a bug that causes a floating point exception
    //upm::GroveLight* light = new upm::GroveLight(LIGHTSENSOR_PIN);
    //upm::GroveTemp* tempSensor = new upm::GroveTemp(TEMPSENSOR_PIN);

    //Init touch sensor
    //create GPIO and initiate it with pin 8
    mraa::Gpio* touch = new mraa::Gpio(TOUCHSENSOR_PIN);
  //set direction to input
    touch->dir(mraa::DIR_IN);

    //Init button
    mraa::Gpio* button = new mraa::Gpio(BUTTON_PIN);
  //set direction to input
    button->dir(mraa::DIR_IN);

    //Init relay
    mraa::Gpio* relay = new mraa::Gpio(RELAY_PIN);
    //set direction to input
    relay->dir(mraa::DIR_OUT);
    relay->write(0);

  //Main loop
  while(1) {

    //Loop waiting for plate to be placed
      lcd->setCursor(0,0);
      lcd->write("Ready to eat     ");
//    while ( get_light(lightadc) > lightThreshold ) {
    while ( button->read() == 0 ) {

            sleep(1);
            //std::cout << "waiting for plate" << std::endl;
    }

    play_chord(sound,0,2);

    //Turn on relay & get weight of plate
    relay->write(1);
    int plate_wt ;
    plate_wt = get_wt(adc,zero_scale_wt);
      int food_wt ;

    //Stay in this 2nd loop, with plate in position and food being added
    //with each button press.
      while( 1 ) {
      lcd->setCursor(0,0);
      lcd->write("Feed me     ");
          //std::cout << "waiting for food" << std::endl;

          //Debounce of button likely already builtin
          if (button->read()) {
              std::cout << sound->playSound(2300, 100000) << std::endl;

        food_wt = get_wt(adc,zero_scale_wt) - plate_wt ;
        //Push food_wt to webserver
        std::cout << "Food wt = " << food_wt << std::endl ;
        lcd->setCursor(1,0);
        sprintf(msg,"Food wt = %d",food_wt);
        lcd->write(msg);
        sleep(1);
        //Take picture after 1 sec, getting hands out of the way
          //Throw away a couple of captures to get things up-and-running.
        capture >> frame;
        capture >> frame;
        capture >> frame;
        imwrite("capture.png", frame);
        // Awesome link: http://sirupsen.com/a-simple-imgur-bash-screenshot-utility/
        // send capture.png to imgur with system() invocation of curl
        imgurUrl = exec("curl -s -F \"image=@capture.png\" -H \"Authorization: Client-ID 9c382db2715e410\" https://api.imgur.com/3/upload.xml | grep -E -o \"<link>(.)*</link>\" | grep -E -o \"http://i.imgur.com/[^<]*\"");
        std::cout << imgurUrl;

        ofstream jsonFile;
        jsonFile.open("file.json");
        jsonFile << "{";
        jsonFile << "\"name\":";
        jsonFile << "\"" << "George Jetson" << "\",";
        jsonFile << "\"image\":";
        jsonFile << "\"" << imgurUrl << "\",";
        jsonFile << "\"weight\":";
        jsonFile << "\"" << food_wt << "\"";
        jsonFile << "}";
        jsonFile.close();

        // ToDo: send imgur URL and food_wt to webserver with system() invocation of curl
        // ToDo: Write a formatted JSON string (likely using a fstream) to file.json
        // ToDo: uncomment this code which will send the file.json to the web
        std::cout << exec("curl -d @file.json -H \"Content-Type: application/json\" http://pacific-shelf-3302.herokuapp.com/api/meals");
        //New plate wt includes food added in previous step.
        plate_wt = food_wt;
      }
      sleep(1);


      //button is still pressed, {long press will exit)
      if ( touch->read() ) break ;

     // int lightValue = get_light(lightadc);
      //if ( lightValue > lightThreshold ) break ;
    }

    //Plate has been removed, we are done with the session
      lcd->setCursor(0,0);
      lcd->write("Bon Apetit!");
      lcd->setCursor(1,0);
      lcd->write("              ");
      relay->write(0);
      //sound buzzer
      play_chord(sound,5,7);

      sleep(4);
  }

}
