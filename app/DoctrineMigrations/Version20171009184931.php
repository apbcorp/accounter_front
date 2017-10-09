<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171009184931 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `user` ADD COLUMN `units` VARCHAR(255) NOT NULL;
            ALTER TABLE `kontragent` ADD COLUMN `unit_id` INT(11) UNSIGNED NOT NULL;
            ALTER TABLE `ground` ADD COLUMN `unit_id` INT(11) UNSIGNED NOT NULL;
            ALTER TABLE `meter` ADD COLUMN `unit_id` INT(11) UNSIGNED NOT NULL;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE `user` DROP COLUMN `units`;
            ALTER TABLE `kontragent` DROP COLUMN `unit_id`;
            ALTER TABLE `ground` DROP COLUMN `unit_id`;
            ALTER TABLE `meter` DROP COLUMN `unit_id`;
        ');
    }
}
