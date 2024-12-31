// controller/RouteController.java
package com.example.instagramclone.controller.routes;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RouteController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

}
