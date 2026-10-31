import io.dataease.utils.ConfigUtils;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.core.io.FileSystemResource;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.*;
import java.util.*;

public class ReadConfigModels {
    public static void main(String[] args) throws Exception {
        Path root = Path.of(args[0]).toRealPath();
        Path home = root.resolve("home");
        if (!System.getProperty("user.home").equals(home.toString())) throw new IllegalStateException("HOME_IDENTITY_MISMATCH");
        Path file = home.resolve("opt/dataease3.0/config/application.yml");
        if (Files.isSymbolicLink(file)) throw new IllegalStateException("CONFIG_SYMLINK_REFUSED");
        YamlPropertiesFactoryBean reader = new YamlPropertiesFactoryBean();
        reader.setResources(new FileSystemResource(file));
        Properties properties = reader.getObject();
        Map<String, Boolean> checks = new LinkedHashMap<>();
        for (String key : List.of("data", "ehcache", "driver", "custom-drivers", "report", "excel", "exportData", "static-resource", "font", "substitule", "share-secret", "engine", "i18n")) {
            String fullKey = "dataease.path." + key;
            String spring = properties.getProperty(fullKey);
            String fixed = ConfigUtils.getConfig(fullKey, "__MISSING__");
            if (spring == null || !spring.equals(fixed) || "__MISSING__".equals(fixed)) throw new IllegalStateException("READ_MODEL_MISMATCH_" + key);
            String path = spring;
            if (key.equals("engine")) {
                if (!path.startsWith("jdbc:h2:")) throw new IllegalStateException("ENGINE_URL_REFUSED");
                path = path.substring(8).split(";", 2)[0];
            } else if (key.equals("i18n")) {
                path = Path.of(java.net.URI.create(path)).toString();
            }
            Path resolved = Path.of(path).toAbsolutePath().normalize();
            if (!resolved.startsWith(root)) throw new IllegalStateException("PATH_ESCAPE_" + key);
            for (Path ancestor = resolved; ancestor != null && ancestor.startsWith(root); ancestor = ancestor.getParent())
                if (Files.isSymbolicLink(ancestor)) throw new IllegalStateException("PATH_SYMLINK_" + key);
            checks.put(fullKey, true);
        }
        String logging = properties.getProperty("logging.file.path");
        checks.put("logging.file.path", logging != null && Path.of(logging).normalize().startsWith(root));
        checks.put("metadata_target", properties.getProperty("spring.datasource.url", "").matches("^jdbc:(mariadb|mysql)://(localhost|127\\.0\\.0\\.1):3307/s02_symbolic_20261029(?:[?;].*)?$"));
        checks.put("jcache", "jcache".equals(properties.getProperty("spring.cache.type")));
        checks.put("quartz_delay", "PT24H".equals(properties.getProperty("quartz.startup-delay")));
        checks.put("ddl_none", "none".equals(properties.getProperty("spring.jpa.hibernate.ddl-auto")));
        checks.put("port", "8110".equals(properties.getProperty("server.port")));
        checks.put("loopback_binding", "127.0.0.1".equals(properties.getProperty("server.address")));
        System.out.println(new ObjectMapper().writeValueAsString(checks));
        if (checks.values().stream().anyMatch(value -> !value)) System.exit(1);
    }
}
