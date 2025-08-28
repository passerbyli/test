using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using dotnetCore.Model;

namespace dotnetCore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// 获取天气
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetWeather")]
        //[ApiExplorerSettings(IgnoreApi = true)]
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }


        
        [HttpPost]
        [Route("createTask")]
        //[ApiExplorerSettings(IgnoreApi = true)]
        public IList<CusTask> CreateTask(CusTask cusTask)
        {
            var cus = new List<CusTask>();
            cus.Add(new CusTask()
            {
                Title="aaa"
            });
            return cus;
        }


    }
}
