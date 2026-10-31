import java.nio.file.*;
import java.sql.*;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.core.io.FileSystemResource;
import io.dataease.datasource.type.Mysql;
import io.dataease.utils.EncryptUtils;
public class FreshConnectionIdentity {
 static final String DB="s02_symbolic_20261029";
 static final ObjectMapper JSON=new ObjectMapper();
 static void need(boolean x,String m){if(!x)throw new IllegalStateException(m);}
 static Map<String,Object> identity(String url,String user,String pass)throws Exception{
  need(url.matches("^jdbc:(mysql|mariadb)://(127\\.0\\.0\\.1|localhost):3307/"+DB+"(?:[?;].*)?$"),"TARGET_REFUSED");
  try(Connection c=DriverManager.getConnection(url,user,pass);Statement s=c.createStatement();ResultSet rs=s.executeQuery("SELECT DATABASE(),@@port,CURRENT_USER()")){
   need(rs.next(),"NO_IDENTITY");need(DB.equals(rs.getString(1))&&rs.getInt(2)==3307,"WRONG_DATABASE");
   return Map.of("database",rs.getString(1),"port",rs.getInt(2),"account",rs.getString(3));
  }
 }
 public static void main(String[] args)throws Exception{
  Path root=Path.of(args[0]);YamlPropertiesFactoryBean y=new YamlPropertiesFactoryBean();y.setResources(new FileSystemResource(root.resolve("home/opt/dataease3.0/config/application.yml")));Properties p=y.getObject();
  Class.forName("org.mariadb.jdbc.Driver");String url=p.getProperty("spring.datasource.url"),u=p.getProperty("spring.datasource.username"),pw=p.getProperty("spring.datasource.password");
  Map<String,Object> result=new LinkedHashMap<>();result.put("metadata_config_actual_connection",identity(url,u,pw));
  try(Connection c=DriverManager.getConnection(url,u,pw);Statement s=c.createStatement()){
   try(ResultSet r=s.executeQuery("SELECT aes_key FROM core_rsa")){need(r.next(),"RSA_MISSING");EncryptUtils.initKeys(r.getString(1));need(!r.next(),"RSA_MULTIPLE");}
   for(String table:List.of("core_datasource","core_de_engine")){
    try(ResultSet r=s.executeQuery("SELECT id,type,configuration FROM "+table)){
     need(r.next(),"MISSING_"+table);String id=r.getString(1);need("mysql".equals(r.getString(2)),"TYPE_REFUSED");if(table.equals("core_datasource"))need("985188400292302848".equals(id),"DS_ID_REFUSED");
     String plain=(String)EncryptUtils.aesDecrypt(r.getString(3));Mysql m=JSON.readValue(plain,Mysql.class);need(!m.isUseSSH(),"SSH_REFUSED");Map<String,Object> entry=new LinkedHashMap<>(identity(m.getJdbc(),m.getUsername(),m.getPassword()));entry.put("id",id);result.put(table,entry);need(!r.next(),"EXTRA_"+table);
    }
   }
   for(String table:List.of("core_datasource_task","core_dataset_table_field")){
    String where=table.equals("core_dataset_table_field")?" WHERE dataset_table_id=7520739241744142336":"";
    try(ResultSet r=s.executeQuery("SELECT COUNT(*) FROM "+table+where)){r.next();int count=r.getInt(1);need(count==(table.equals("core_datasource_task")?0:19),"FIXTURE_COUNT_REFUSED");result.put(table+"_count",count);}
   }
  }
  System.out.println(JSON.writeValueAsString(result));
 }
}
