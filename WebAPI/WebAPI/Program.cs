var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// 1. 定義策略名稱
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000") // 允許 React 的網址
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});
// Program.cs
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        // This ensures the JSON looks like standard web JSON
        options.SerializerSettings.ContractResolver =
            new Newtonsoft.Json.Serialization.DefaultContractResolver();
    });

var app = builder.Build();
app.UseStaticFiles(); // 啟用預設的 wwwroot 靜態檔案

// 針對自定義的 Photos 資料夾進行映射
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Photos")),
    RequestPath = "/Photos"
});
// Configure the HTTP request pipeline.
// 2. 使用 CORS (注意順序：必須放在 UseRouting 之後，UseAuthorization 之前)
app.UseCors(myAllowSpecificOrigins);
app.UseAuthorization();

app.MapControllers();

app.Run();
