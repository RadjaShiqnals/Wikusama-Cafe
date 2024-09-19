<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WelcomeItemController extends Controller
{
    public function showWelcomePage()
    {
        $services = [
            [
                'image' => 'path/to/image1.jpg',
                'title' => 'Service 1',
                'description' => 'Description for service 1',
            ],
            [
                'image' => 'path/to/image2.jpg',
                'title' => 'Service 2',
                'description' => 'Description for service 2',
            ],
            [
                'image' => 'path/to/image3.jpg',
                'title' => 'Service 3',
                'description' => 'Description for service 3',
            ],
        ];

        return view('welcome', compact('services'));
    }

}
